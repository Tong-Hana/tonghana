/**
 * @swagger
 * /api/likes/reject:
 *   patch:
 *     summary: 받은 좋아요 거절
 *     description: |
 *       로그인한 사용자가 자신에게 온 좋아요 요청을 거절합니다.
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
 *                 description: 거절할 매칭의 ID
 *     responses:
 *       200:
 *         description: 거절 처리 성공
 *       403:
 *         description: 거절 권한 없음
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
    data: { matchStatus: "REJECTED" },
  });

  return NextResponse.json({ message: "거절 처리되었습니다." });
}
