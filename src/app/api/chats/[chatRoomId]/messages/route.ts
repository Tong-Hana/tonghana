import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const TEST_USER_ID = 199;

export async function GET(req: NextRequest, context: any) {
  const chatRoomIdRaw = context?.params?.chatRoomId;

  if (!chatRoomIdRaw || isNaN(Number(chatRoomIdRaw))) {
    return NextResponse.json(
      { code: "BAD_REQUEST", message: "유효하지 않은 채팅방 ID입니다." },
      { status: 400 },
    );
  }
  const chatRoomId = Number(chatRoomIdRaw);

  const chatRoom = await prisma.chatRooms.findUnique({
    where: { roomId: chatRoomId },
    include: {
      chatMessages: {
        orderBy: { regdate: "asc" },
      },
    },
  });

  if (
    !chatRoom ||
    (chatRoom.userId !== TEST_USER_ID && chatRoom.userId2 !== TEST_USER_ID)
  ) {
    return NextResponse.json(
      { code: "FORBIDDEN", message: "채팅방 접근 권한이 없습니다." },
      { status: 403 },
    );
  }

  return NextResponse.json({ chatRoomId, messages: chatRoom.chatMessages });
}
