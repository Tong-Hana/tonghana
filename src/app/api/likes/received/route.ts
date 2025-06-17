/**
 * @swagger
 * /api/likes/received:
 *   get:
 *     summary: 내가 받은 좋아요 목록 조회
 *     description: 로그인한 사용자가 현재까지 받은 좋아요(PENDING 상태)의 목록을 조회합니다.
 *     tags: [MatchLikes]
 *     responses:
 *       200:
 *         description: 받은 좋아요 목록 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   matchId:
 *                     type: integer
 *                   matchStatus:
 *                     type: string
 *                   sent:
 *                     type: object
 *                     properties:
 *                       userId:
 *                         type: integer
 *                       nickname:
 *                         type: string
 *                       profileImage:
 *                         type: string
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json(
      { message: "인증되지 않은 사용자입니다." },
      { status: 401 },
    );
  }
  const userId = user.userId;

  const receivedLikes = await prisma.userMatchLog.findMany({
    where: {
      receiveId: userId,
      matchStatus: "PENDING",
    },
    include: {
      sent: {
        select: {
          userId: true,
          nickname: true,
          profileImage: true,
        },
      },
    },
    orderBy: {
      matchId: "desc",
    },
  });

  return NextResponse.json(receivedLikes);
}
