/**
 * @swagger
 * /api/chats/{chatRoomId}/leave:
 *   delete:
 *     summary: 채팅방 나가기
 *     description: |
 *       로그인한 사용자가 참여 중인 채팅방을 나가며, 해당 채팅방의 메시지와 채팅방 정보가 삭제됩니다.
 *       또한, 관련된 매칭 이력이 있을 경우 상태가 `REJECTED`로 변경됩니다.
 *     tags: [Chat]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: chatRoomId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: 나갈 채팅방의 ID
 *     responses:
 *       200:
 *         description: 채팅방 퇴장 및 데이터 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: SUCCESS
 *                 message:
 *                   type: string
 *                   example: 채팅방 나가기와 매칭 상태가 변경되었습니다.
 *       400:
 *         description: 유효하지 않은 채팅방 ID
 *       401:
 *         description: 인증되지 않음
 *       403:
 *         description: 채팅방 접근 권한 없음
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function DELETE(
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

  const roomId = Number(chatRoomId);

  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json(
      { code: "UNAUTHORIZED", message: "로그인이 필요합니다." },
      { status: 401 },
    );
  }

  const chatRoom = await prisma.chatRoom.findUnique({
    where: { roomId },
  });

  if (
    !chatRoom ||
    (chatRoom.userId !== user.userId && chatRoom.userId2 !== user.userId)
  ) {
    return NextResponse.json(
      { code: "FORBIDDEN", message: "해당 채팅방에 대한 권한이 없습니다." },
      { status: 403 },
    );
  }

  const match = await prisma.userMatchLog.findFirst({
    where: {
      OR: [
        { sentId: chatRoom.userId, receiveId: chatRoom.userId2 },
        { sentId: chatRoom.userId2, receiveId: chatRoom.userId },
      ],
    },
  });

  if (match) {
    await prisma.userMatchLog.update({
      where: { matchId: match.matchId },
      data: { matchStatus: "REJECTED" },
    });
  }

  await prisma.chatRoom.delete({ where: { roomId } });

  return NextResponse.json({
    message: "채팅방 나가기와 매칭 상태가 변경되었습니다.",
  });
}
