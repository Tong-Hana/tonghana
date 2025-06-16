// 채팅 메세지 API
import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ message: "POST OK" });
}
