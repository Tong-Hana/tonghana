// /app/profiles/me/pairing-answers/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json(
        { code: "UNAUTHORIZED", message: "로그인이 필요합니다." },
        { status: 401 },
      );
    }

    const body = await req.json();
    const {
      car_budget,
      date_budget,
      shoes_budget,
      preferred_city,
      ideal_income_range,
    } = body;

    if (
      !car_budget ||
      !date_budget ||
      !shoes_budget ||
      !preferred_city ||
      !ideal_income_range
    ) {
      return NextResponse.json(
        { code: "INVALID_INPUT", message: "모든 항목을 입력해주세요." },
        { status: 400 },
      );
    }

    const answer = await prisma.pairingAnswer.upsert({
      where: { user_id: authUser.userId },
      update: {
        car_budget: BigInt(car_budget),
        date_budget,
        shoes_budget,
        preferred_city,
        ideal_income_range,
      },
      create: {
        user_id: authUser.userId,
        car_budget: BigInt(car_budget),
        date_budget,
        shoes_budget,
        preferred_city,
        ideal_income_range,
      },
    });

    return NextResponse.json(
      {
        message: "페어링북 응답이 저장되었습니다.",
        data: {
          ...answer,
          car_budget: answer.car_budget.toString(), // JSON.stringify()는 BigInt를 처리할 수 없으므로 BigInt → .toString()
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("❌ 저장 실패:", error);
    return NextResponse.json(
      { code: "SERVER_ERROR", message: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
