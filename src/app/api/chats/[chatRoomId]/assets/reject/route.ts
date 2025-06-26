/**
 * @swagger
 * /api/chats/{chatRoomId}/assets/reject:
 *   patch:
 *     summary: 채팅방 자산 공개 거절
 *     description: |
 *       로그인한 사용자가 참여 중인 채팅방에서 자산 공개를 거절합니다.
 *       사용자는 본인에 해당하는 동의 필드(`isAgree` 또는 `isAgree2`)만 false로 설정됩니다.
 *     tags: [Chat]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: chatRoomId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: 거절할 채팅방 ID
 *     responses:
 *       200:
 *         description: 거절 성공
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
 *                   example: 자산 공개를 거절했습니다.
 *                 data:
 *                   type: object
 *                   properties:
 *                     roomId:
 *                       type: integer
 *                       example: 3
 *                     userId:
 *                       type: integer
 *                       example: 185
 *                     userId2:
 *                       type: integer
 *                       example: 199
 *                     isAgree:
 *                       type: boolean
 *                       example: false
 *                     isAgree2:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: 유효하지 않은 채팅방 ID
 *       401:
 *         description: 인증되지 않음
 *       403:
 *         description: 채팅방 접근 권한 없음
 *       404:
 *         description: 채팅방을 찾을 수 없음
 */

import { NextRequest, NextResponse } from "next/server";
import { masterPrisma } from "@/lib/prisma/masterClient";
import { replicaPrisma } from "@/lib/prisma/replicaClient";
import { getAuthUser } from "@/lib/auth";

export async function PATCH(
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
      { code: "UNAUTHORIZED", message: "로그인이 필요합니다." },
      { status: 401 },
    );
  }

  const chatRoom = await replicaPrisma.chatRoom.findUnique({
    where: { roomId: chatRoomIdNum },
  });

  if (!chatRoom) {
    return NextResponse.json(
      { code: "NOT_FOUND", message: "채팅방을 찾을 수 없습니다." },
      { status: 404 },
    );
  }

  if (chatRoom.userId !== user.userId && chatRoom.userId2 !== user.userId) {
    return NextResponse.json(
      { code: "FORBIDDEN", message: "채팅방 접근 권한이 없습니다." },
      { status: 403 },
    );
  }

  const updateData =
    chatRoom.userId === user.userId ? { isAgree: false } : { isAgree2: false };

  const updatedRoom = await masterPrisma.chatRoom.update({
    where: { roomId: chatRoomIdNum },
    data: updateData,
    select: {
      roomId: true,
      userId: true,
      userId2: true,
      isAgree: true,
      isAgree2: true,
    },
  });

  try {
    const response = await fetch(
      "http://localhost:3001/api/notify-asset-change",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: updatedRoom.roomId,
          userId: updatedRoom.userId,
          userId2: updatedRoom.userId2,
          isAgree: updatedRoom.isAgree,
          isAgree2: updatedRoom.isAgree2,
        }),
      },
    );

    const resJson = await response.json();
  } catch (e) {
    console.error("채팅 서버 요청 실패:", e);
  }

  return NextResponse.json(
    {
      data: updatedRoom,
      message: "자산 공개를 거절했습니다.",
    },
    { status: 200 },
  );
}
