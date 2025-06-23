/**
 * @swagger
 * /api/likes/accept:
 *   patch:
 *     summary: 받은 좋아요 수락
 *     description: |
 *       로그인한 사용자가 자신에게 온 좋아요 요청을 수락합니다.
 *       matchId는 /api/likes/received에서 받아온 매칭 ID 사용를 사용합니다.
 *     tags: [MatchLikes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - matchId
 *             properties:
 *               matchId:
 *                 type: integer
 *                 description: 수락할 매칭의 ID
 *     responses:
 *       200:
 *         description: 수락 처리 성공
 *       403:
 *         description: 수락 권한 없음
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function PATCH(req: Request) {
  const { matchId } = await req.json();
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json(
      { message: "인증되지 않은 사용자입니다." },
      { status: 401 },
    );
  }
  const userId = user.userId;

  const match = await prisma.userMatchLog.findUnique({ where: { matchId } });

  if (!match || match.receiveId !== userId) {
    return NextResponse.json(
      { message: "처리할 수 없는 요청입니다." },
      { status: 403 },
    );
  }

  await prisma.userMatchLog.update({
    where: { matchId },
    data: { matchStatus: "ACCEPTED" },
  });

  const existingRoom = await prisma.chatRoom.findFirst({
    where: {
      OR: [
        { userId: match.sentId, userId2: match.receiveId },
        { userId: match.receiveId, userId2: match.sentId },
      ],
    },
  });

  if (!existingRoom) {
    await prisma.chatRoom.create({
      data: {
        userId: match.sentId,
        userId2: match.receiveId,
      },
    });
  }

  return NextResponse.json({
    message: "좋아요 수락처리와 채팅방이 생성되었습니다.",
  });
}
