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
 *                     example: 7
 *                   sentId:
 *                     type: integer
 *                     example: 204
 *                   receiveId:
 *                     type: integer
 *                     example: 205
 *                   matchStatus:
 *                     type: string
 *                     example: "PENDING"
 *                   sent:
 *                     type: object
 *                     properties:
 *                       userId:
 *                         type: integer
 *                         example: 204
 *                       nickname:
 *                         type: string
 *                         example: "테스트1"
 *                       profileImage:
 *                         type: string
 *                         example: "https://tonghanabucket.s3.ap-northeast-2.amazonaws.com/1272f592-fe53-4c9a-a346-d90b6051b2e7.jpeg"
 *                       birthYear:
 *                         type: integer
 *                         example: 2000
 *                       city:
 *                         type: string
 *                         example: "서울시 중구"
 *                       currentType:
 *                         type: string
 *                         nullable: true
 *                         example: "NEUTRAL"
 *                       goalType:
 *                         type: string
 *                         example: "MARRIAGE"
 *                       goalAmount:
 *                         type: string
 *                         example: "50000000"
 *                       goalPeriod:
 *                         type: string
 *                         example: "WITHIN_3_YEARS"
 */

import { NextResponse } from "next/server";
import { replicaPrisma } from "@/lib/prisma/replicaClient";
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

  const receivedLikes = await replicaPrisma.userMatchLog.findMany({
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
          birthYear: true,
          city: true,
          currentType: true,
          goalType: true,
          goalAmount: true,
          goalPeriod: true,
        },
      },
    },
    orderBy: {
      matchId: "desc",
    },
  });

  const serializedLikes = receivedLikes.map((log) => ({
    ...log,
    sent: {
      ...log.sent,
      goalAmount: log.sent.goalAmount?.toString() ?? null,
    },
  }));

  return NextResponse.json(serializedLikes);
}
