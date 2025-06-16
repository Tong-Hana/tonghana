// 채팅방 나가기 API
import { NextResponse } from "next/server";

export async function DELETE() {
  return NextResponse.json({ message: "DELETE OK" });
}
