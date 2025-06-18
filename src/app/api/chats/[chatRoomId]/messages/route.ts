import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET(req: NextRequest, context: any) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json(
      { code: "UNAUTHORIZED", message: "인증되지 않았습니다." },
      { status: 401 },
    );
  }

  const chatRoomIdRaw = context?.params?.chatRoomId;
  if (!chatRoomIdRaw || isNaN(Number(chatRoomIdRaw))) {
    return NextResponse.json(
      { code: "BAD_REQUEST", message: "유효하지 않은 채팅방 ID입니다." },
      { status: 400 },
    );
  }
  const chatRoomId = Number(chatRoomIdRaw);

  const chatRoom = await prisma.chatRoom.findUnique({
    where: { roomId: chatRoomId },
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

  return NextResponse.json({ chatRoomId, messages: chatRoom.chatMessage });
}

export async function POST(req: NextRequest, context: any) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json(
      { code: "UNAUTHORIZED", message: "인증되지 않았습니다." },
      { status: 401 },
    );
  }

  const chatRoomIdRaw = context?.params?.chatRoomId;
  if (!chatRoomIdRaw || isNaN(Number(chatRoomIdRaw))) {
    return NextResponse.json(
      { code: "BAD_REQUEST", message: "유효하지 않은 채팅방 ID입니다." },
      { status: 400 },
    );
  }
  const chatRoomId = Number(chatRoomIdRaw);

  const { message } = await req.json();
  if (!message) {
    return NextResponse.json(
      { code: "BAD_REQUEST", message: "메시지 내용을 입력해주세요." },
      { status: 400 },
    );
  }

  const chatRoom = await prisma.chatRoom.findUnique({
    where: { roomId: chatRoomId },
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
      roomId: chatRoomId,
      userId: user.userId,
      message,
      regdate: new Date(),
    },
  });

  return NextResponse.json({ message: "메시지가 전송되었습니다.", newMessage });
}
