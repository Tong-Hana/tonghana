/**
 * @swagger
 * /api/chats/{chatRoomId}:
 *   get:
 *     summary: 채팅방 정보 조회
 *     description: |
 *       로그인한 사용자가 참여 중인 채팅방의 정보를 조회합니다.
 *       해당 채팅방의 참여자(userId, userId2) 및 각자의 자산 공개 동의 여부(isAgree, isAgree2)를 반환합니다.
 *     tags: [Chat]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: chatRoomId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: 조회할 채팅방 ID
 *     responses:
 *       200:
 *         description: 채팅방 정보 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 채팅방 정보를 조회했습니다.
 *                 data:
 *                   type: object
 *                   properties:
 *                     chatRoomId:
 *                       type: integer
 *                       example: 1
 *                     userId:
 *                       type: integer
 *                       example: 101
 *                     userId2:
 *                       type: integer
 *                       example: 202
 *                     isAgree:
 *                       type: boolean
 *                       nullable: true
 *                       example: true
 *                     isAgree2:
 *                       type: boolean
 *                       nullable: true
 *                       example: false
 *       400:
 *         description: 유효하지 않은 채팅방 ID
 *       401:
 *         description: 인증되지 않음
 *       403:
 *         description: 채팅방 접근 권한 없음
 */

import { replicaPrisma } from "@/lib/prisma/replicaClient";
import { NextResponse, NextRequest } from "next/server";
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

  const chatRoom = await replicaPrisma.chatRoom.findUnique({
    where: { roomId: chatRoomIdNum },
    select: {
      roomId: true,
      userId: true,
      userId2: true,
      isAgree: true,
      isAgree2: true,
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
    message: "채팅방 정보를 조회했습니다.",
    data: {
      chatRoomId: chatRoom.roomId,
      userId: chatRoom.userId,
      userId2: chatRoom.userId2,
      isAgree: chatRoom.isAgree,
      isAgree2: chatRoom.isAgree2,
    },
  });
}
