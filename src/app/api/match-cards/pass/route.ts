/**
 * @swagger
 * /api/match-cards/pass:
 *   patch:
 *     tags:
 *       - MatchCards
 *     summary: 매칭 카드 리스트에서 상대방을 패스 처리(X 버튼)
 *     description:
 *       로그인한 유저가 매칭카드 리스트에 뜬 특정 유저를 패스 처리합니다.
 *       - UserMatchLog에는 matchStatus를 REJECTED로 저장하고
 *       - UserRecoLog에는 likeStatus를 true로 저장합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               receiveId:
 *                 type: integer
 *                 example: 102
 *                 description: 거절할 상대방 유저 ID
 *     responses:
 *       200:
 *         description: 거절 처리 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 거절 처리 완료
 *       401:
 *         description: 인증되지 않은 사용자
 *       403:
 *         description: 처리할 수 없는 요청
 *       409:
 *         description: 이미 처리된 매칭
 *       500:
 *         description: 서버 오류
 */

import { NextResponse } from "next/server";
import { masterPrisma } from "@/lib/prisma/masterClient";
import { replicaPrisma } from "@/lib/prisma/replicaClient";
import { getAuthUser } from "@/lib/auth";
import { MatchStatus } from "@prisma/client";

export async function PATCH(req: Request) {
  const { receiveId } = await req.json();
  const user = await getAuthUser();

  if (!user) {
    return NextResponse.json(
      { message: "인증되지 않은 사용자입니다." },
      { status: 401 },
    );
  }

  const userId = user.userId;

  // 이미 존재하는 매칭 로그인지 확인
  const existingMatch = await replicaPrisma.userMatchLog.findFirst({
    where: {
      sentId: userId,
      receiveId: receiveId,
    },
  });

  // 이미 처리한 거면 중복 방지
  if (existingMatch) {
    return NextResponse.json(
      { message: "이미 처리된 매칭입니다." },
      { status: 409 },
    );
  }

  try {
    await masterPrisma.$transaction([
      // 1. UserMatchLog: REJECTED 상태로 생성
      masterPrisma.userMatchLog.create({
        data: {
          sentId: userId,
          receiveId: receiveId,
          matchStatus: MatchStatus.REJECTED,
        },
      }),

      // 2. UserRecoLog: likeStatus true로 생성
      masterPrisma.userRecoLog.create({
        data: {
          baseUserId: userId,
          candidateId: receiveId,
          likeStatus: true,
        },
      }),
    ]);

    return NextResponse.json({ message: "거절 처리 완료" }, { status: 200 });
  } catch (error) {
    console.error("REJECT 처리 오류:", error);
    return NextResponse.json(
      { message: "서버 오류로 처리에 실패했습니다." },
      { status: 500 },
    );
  }
}
