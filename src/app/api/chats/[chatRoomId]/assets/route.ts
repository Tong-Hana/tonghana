import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function PATCH(req: NextRequest, context: any) {
  const chatRoomIdRaw = context?.params?.chatRoomId;
  if (!chatRoomIdRaw || isNaN(Number(chatRoomIdRaw))) {
    return NextResponse.json(
      { code: "BAD_REQUEST", message: "유효하지 않은 채팅방 ID입니다." },
      { status: 400 },
    );
  }
  const chatRoomId = Number(chatRoomIdRaw);

  const token = req.cookies.get("accessToken")?.value;
  if (!token) {
    return NextResponse.json(
      { code: "UNAUTHORIZED", message: "로그인이 필요합니다." },
      { status: 401 },
    );
  }

  let userId: number;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
    };
    userId = payload.userId;
  } catch (err) {
    return NextResponse.json(
      { code: "INVALID_TOKEN", message: "유효하지 않은 토큰입니다." },
      { status: 401 },
    );
  }

  const chatRoom = await prisma.chatRoom.findUnique({
    where: { roomId: chatRoomId },
  });

  if (!chatRoom) {
    return NextResponse.json(
      { code: "NOT_FOUND", message: "채팅방을 찾을 수 없습니다." },
      { status: 404 },
    );
  }

  if (chatRoom.userId !== userId && chatRoom.userId2 !== userId) {
    return NextResponse.json(
      { code: "FORBIDDEN", message: "채팅방 접근 권한이 없습니다." },
      { status: 403 },
    );
  }

  const updateData =
    chatRoom.userId === userId ? { isAgree: true } : { isAgree2: true };

  const updatedRoom = await prisma.chatRoom.update({
    where: { roomId: chatRoomId },
    data: updateData,
  });

  return NextResponse.json(
    {
      code: "SUCCESS",
      data: updatedRoom,
      message: "자산 공개에 동의했습니다.",
    },
    { status: 200 },
  );
}
