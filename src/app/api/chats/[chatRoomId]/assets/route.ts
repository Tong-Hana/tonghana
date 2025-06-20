/**
 * @swagger
 * /api/chats/{chatRoomId}/assets:
 *   get:
 *     summary: 채팅방의 모든 사용자 자산 공개 동의 여부 조회
 *     description: |
 *       채팅방에 참여 중인 모든 사용자의 자산 공개 동의 여부를 반환합니다.
 *     tags: [Chat]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: chatRoomId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: 채팅방 ID
 *     responses:
 *       200:
 *         description: 동의 여부 목록 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 자산 공개 동의 현황을 조회했습니다.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       userId:
 *                         type: integer
 *                         example: 123
 *                       isAgreed:
 *                         type: boolean
 *                         example: true
 */

import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ chatRoomId: string }> },
) {
  const { chatRoomId } = await context.params;

  if (!chatRoomId || isNaN(Number(chatRoomId))) {
    return NextResponse.json(
      { message: "유효하지 않은 채팅방 ID입니다." },
      { status: 400 },
    );
  }

  const chatRoomIdNum = Number(chatRoomId);
  const user = await getAuthUser();

  if (!user) {
    return NextResponse.json(
      { message: "로그인이 필요합니다." },
      { status: 401 },
    );
  }

  const chatRoom = await prisma.chatRoom.findUnique({
    where: { roomId: chatRoomIdNum },
    select: {
      userId: true,
      userId2: true,
      isAgree: true,
      isAgree2: true,
    },
  });

  if (!chatRoom) {
    return NextResponse.json(
      { message: "채팅방을 찾을 수 없습니다." },
      { status: 404 },
    );
  }

  if (chatRoom.userId !== user.userId && chatRoom.userId2 !== user.userId) {
    return NextResponse.json(
      { message: "채팅방 접근 권한이 없습니다." },
      { status: 403 },
    );
  }

  return NextResponse.json({
    message: "자산 공개 동의 현황을 조회했습니다.",
    data: [
      {
        userId: chatRoom.userId,
        isAgreed: chatRoom.isAgree,
      },
      {
        userId: chatRoom.userId2,
        isAgreed: chatRoom.isAgree2,
      },
    ],
  });
}
