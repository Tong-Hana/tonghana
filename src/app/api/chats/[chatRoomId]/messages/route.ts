/**
 * @swagger
 * /api/chats/{chatRoomId}/messages:
 *   get:
 *     summary: 채팅 메시지 조회
 *     description: |
 *       로그인한 사용자가 접근 가능한 채팅방의 메시지를 시간순으로 반환합니다.
 *       메시지 본문에는 사기, 욕설 등 금지어가 포함된 경우 자동으로 `*`로 마스킹되어 반환됩니다.
 *     tags: [Chat]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: chatRoomId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: 메시지를 조회할 채팅방 ID
 *     responses:
 *       200:
 *         description: 메시지 목록 반환 (금지어 필터링 적용됨)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 chatRoomId:
 *                   type: integer
 *                   example: 1
 *                 messages:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       messageId:
 *                         type: integer
 *                         example: 101
 *                       userId:
 *                         type: integer
 *                         example: 42
 *                       message:
 *                         type: string
 *                         example: "안녕하세요!"
 *                       regdate:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-06-17T15:05:00Z"
 *       400:
 *         description: 잘못된 요청 (유효하지 않은 채팅방 ID 등)
 *       401:
 *         description: 인증되지 않음
 *       403:
 *         description: 채팅방 접근 권한 없음
 */

import { replicaPrisma } from "@/lib/prisma/replicaClient";
import { NextResponse, NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { filterForbiddenWords } from "@/lib/filterForbiddenWords";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ chatRoomId: string }> },
) {
  const { chatRoomId } = await context.params;

  if (!chatRoomId || isNaN(Number(chatRoomId))) {
    return NextResponse.json(
      { code: "BAD_REQUEST", message: "유효하지 않은 채팅방 ID입니다." },
      { status: 400 },
    );
  }
  const chatRoomIdNum = Number(chatRoomId);

  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json(
      { code: "UNAUTHORIZED", message: "인증되지 않았습니다." },
      { status: 401 },
    );
  }

  const chatRoom = await replicaPrisma.chatRoom.findUnique({
    where: { roomId: chatRoomIdNum },
    include: {
      chatMessage: {
        orderBy: { regdate: "asc" },
        include: {
          user: true,
        },
      },
    },
  });

  if (
    !chatRoom ||
    (chatRoom.userId !== user.userId && chatRoom.userId2 !== user.userId)
  ) {
    return NextResponse.json(
      { code: "FORBIDDEN", message: "채팅방 접근 권한이 없습니다." },
      { status: 403 },
    );
  }

  const [user1, user2] = await replicaPrisma.user.findMany({
    where: {
      userId: { in: [chatRoom.userId, chatRoom.userId2] },
    },
  });

  const messagesWithSender = chatRoom.chatMessage.map((msg) => ({
    messageId: msg.messageId,
    userId: msg.userId,
    message: filterForbiddenWords(msg.message),
    regdate: msg.regdate,
  }));

  return NextResponse.json({
    chatRoomId: chatRoomIdNum,
    messages: messagesWithSender,
  });
}
