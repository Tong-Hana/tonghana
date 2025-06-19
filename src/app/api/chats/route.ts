/**
 * @swagger
 * /api/chats:
 *   get:
 *     summary: 내 채팅방 목록 조회
 *     description: |
 *       로그인한 사용자가 참여 중인 채팅방 목록을 반환합니다.
 *       각 채팅방에는 최근 메시지 정보와 상대방 사용자 정보가 포함되어 있습니다.
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
 *                 message:
 *                   type: string
 *                   example: 채팅방 목록을 조회했습니다.
 *                 chatRooms:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       roomId:
 *                         type: integer
 *                         description: 채팅방 ID
 *                         example: 1
 *                       lastMessage:
 *                         type: string
 *                         nullable: true
 *                         description: 마지막 메시지 내용
 *                         example: "안녕하세요"
 *                       lastMessageAt:
 *                         type: string
 *                         format: date-time
 *                         nullable: true
 *                         description: 마지막 메시지 시간
 *                         example: "2025-06-17T14:00:00Z"
 *                       opponent:
 *                         type: object
 *                         nullable: true
 *                         description: 상대방 유저 정보
 *                         properties:
 *                           userId:
 *                             type: integer
 *                             example: 42
 *                           nickname:
 *                             type: string
 *                             example: "홍길동"
 *                           profileUrl:
 *                             type: string
 *                             example: "/images/profile/42.png"
 *       401:
 *         description: 인증되지 않음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: UNAUTHORIZED
 *                 message:
 *                   type: string
 *                   example: 인증되지 않았습니다.
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

  const chatRooms = await prisma.chatRoom.findMany({
    where: {
      OR: [{ userId: user.userId }, { userId2: user.userId }],
    },
  });

  const opponentIds = chatRooms.map((room) =>
    room.userId === user.userId ? room.userId2 : room.userId,
  );
  const uniqueOpponentIds = [...new Set(opponentIds)];

  const opponents = await prisma.user.findMany({
    where: {
      userId: { in: uniqueOpponentIds },
    },
  });

  const userMap = new Map(opponents.map((u) => [u.userId, u]));

  const response = chatRooms.map((room) => {
    const isUser1 = room.userId === user.userId;
    const opponentId = isUser1 ? room.userId2 : room.userId;
    const opponent = userMap.get(opponentId);

    return {
      roomId: room.roomId,
      lastMessage: room.lastMessage,
      lastMessageAt: room.lastMessageAt,
      opponent: opponent
        ? {
            userId: opponent.userId,
            nickname: opponent.nickname,
            profileUrl: opponent.profileImage,
          }
        : null,
    };
  });

  return NextResponse.json({
    message: "채팅방 목록을 조회했습니다.",
    chatRooms: response,
  });
}
