/**
 * @swagger
 * /api/chats/{chatRoomId}/messages:
 *   get:
 *     summary: 채팅 메시지 조회
 *     description: 로그인한 사용자가 접근 가능한 채팅방의 메시지를 시간순으로 반환합니다.
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
 *         description: 메시지 목록 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 chatRoomId:
 *                   type: integer
 *                 messages:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       messageId:
 *                         type: integer
 *                       roomId:
 *                         type: integer
 *                       userId:
 *                         type: integer
 *                       message:
 *                         type: string
 *                       regdate:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: 인증되지 않음
 *       403:
 *         description: 채팅방 접근 권한 없음
 *       400:
 *         description: 잘못된 요청
 */

/**
 * @swagger
 * /api/chats/{chatRoomId}/messages:
 *   post:
 *     summary: 채팅 메시지 전송
 *     description: 로그인한 사용자가 채팅방에 메시지를 전송합니다.
 *       이 API는 메시지를 DB에 저장하지만, Swagger에서는 실시간 반영(WebSocket)을 확인할 수 없습니다.
 *     tags: [Chat]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: chatRoomId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: 메시지를 보낼 채팅방 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: 메시지 전송 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 메시지가 전송되었습니다.
 *                 newMessage:
 *                   type: object
 *                   properties:
 *                     messageId:
 *                       type: integer
 *                     roomId:
 *                       type: integer
 *                     userId:
 *                       type: integer
 *                     message:
 *                       type: string
 *                     regdate:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: 인증되지 않음
 *       403:
 *         description: 채팅방 접근 권한 없음
 *       400:
 *         description: 메시지 누락 또는 잘못된 요청
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

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

  const chatRoom = await prisma.chatRoom.findUnique({
    where: { roomId: chatRoomIdNum },
    include: {
      chatMessage: {
        orderBy: { regdate: "asc" },
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

  return NextResponse.json({
    chatRoomId: chatRoomIdNum,
    messages: chatRoom.chatMessage,
  });
}

// 메시지 전송
export async function POST(
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

  const { message } = await req.json();
  if (!message || typeof message !== "string") {
    return NextResponse.json(
      { code: "BAD_REQUEST", message: "메시지 내용을 입력해주세요." },
      { status: 400 },
    );
  }

  const chatRoom = await prisma.chatRoom.findUnique({
    where: { roomId: chatRoomIdNum },
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

  const newMessage = await prisma.chatMessage.create({
    data: {
      roomId: chatRoomIdNum,
      userId: user.userId,
      message,
      regdate: new Date(),
    },
  });

  await prisma.chatRoom.update({
    where: { roomId: chatRoomIdNum },
    data: {
      lastMessage: newMessage.message,
      lastMessageAt: newMessage.regdate,
    },
  });

  return NextResponse.json({
    message: "메시지가 전송되었습니다.",
    newMessage,
  });
}
