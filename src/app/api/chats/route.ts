/**
 * @swagger
 * /api/chats:
 *   get:
 *     summary: 내 채팅방 목록 조회
 *     description: |
 *       로그인한 사용자가 속한 채팅방 리스트를 조회합니다.
 *       각 채팅방에는 최근 메시지 1개가 함께 포함되어 있습니다.
 *     tags: [Chat]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: 채팅방 목록 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 chatRooms:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       roomId:
 *                         type: integer
 *                         description: 채팅방 ID
 *                       userId:
 *                         type: integer
 *                       userId2:
 *                         type: integer
 *                       isAgree:
 *                         type: boolean
 *                       isAgree2:
 *                         type: boolean
 *                       chatMessage:
 *                         type: array
 *                         description: 최신 메시지 1개
 *                         items:
 *                           type: object
 *                           properties:
 *                             messageId:
 *                               type: integer
 *                             message:
 *                               type: string
 *                             regdate:
 *                               type: string
 *                               format: date-time
 *                             userId:
 *                               type: integer
 */

import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth";

// 채팅방 리스트 조회
export async function GET(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json(
      { code: "UNAUTHORIZED", message: "인증되지 않았습니다." },
      { status: 401 },
    );
  }

  // 로그인된 유저가 참여한 채팅방 조회
  const chatRooms = await prisma.chatRoom.findMany({
    where: {
      OR: [{ userId: user.userId }, { userId2: user.userId }],
    },
    include: {
      chatMessage: {
        orderBy: { regdate: "desc" },
        take: 1, // 최신 메시지 1개만 포함
      },
    },
  });

  return NextResponse.json({ chatRooms });
}
