/**
 * @swagger
 * /api/chats:
 *   get:
 *     summary: 내 채팅방 목록 조회
 *     description: |
 *       로그인한 사용자가 참여 중인 채팅방 목록을 반환합니다.
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
 *                       lastMessage:
 *                         type: string
 *                         nullable: true
 *                         description: 마지막 메시지 내용
 *                       lastMessageAt:
 *                         type: string
 *                         format: date-time
 *                         nullable: true
 *                         description: 마지막 메시지 전송 시각
 *       401:
 *         description: 인증되지 않음
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
    select: {
      roomId: true,
      userId: true,
      userId2: true,
      lastMessage: true,
      lastMessageAt: true,
    },
  });

  return NextResponse.json({
    message: "채팅방 목록을 조회했습니다.",
    chatRooms,
  });
}
