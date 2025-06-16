/**
 * @swagger
 * /app/profiles/me/pairing-answers:
 *   post:
 *     summary: 페어링북 응답 저장
 *     description: 로그인한 사용자의 페어링북 설문 응답(예산, 선호 도시, 이상적 소득 범위 등)을 저장하거나 업데이트합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - car_budget
 *               - date_budget
 *               - shoes_budget
 *               - preferred_city
 *               - ideal_income_range
 *             properties:
 *               car_budget:
 *                 type: string
 *                 example: "2000"
 *                 description: 자동차 예산 (숫자지만 BigInt 처리로 문자열로 받음)
 *               date_budget:
 *                 type: integer
 *                 example: 10
 *                 description: 데이트 예산
 *               shoes_budget:
 *                 type: integer
 *                 example: 30
 *                 description: 신발 예산
 *               preferred_city:
 *                 type: string
 *                 example: "서울시 강남구"
 *               ideal_income_range:
 *                 type: string
 *                 enum: [NEAR_300, NEAR_500, NEAR_800, OVER_1000]
 *                 example: "NEAR_800"
 *     responses:
 *       201:
 *         description: 응답 저장 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "페어링북 응답이 저장되었습니다."
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     user_id:
 *                       type: integer
 *                       example: 186
 *                     car_budget:
 *                       type: string
 *                       example: "2000"
 *                     date_budget:
 *                       type: integer
 *                       example: 10
 *                     shoes_budget:
 *                       type: integer
 *                       example: 30
 *                     preferred_city:
 *                       type: string
 *                       example: "서울시 강남구"
 *                     ideal_income_range:
 *                       type: string
 *                       example: "NEAR_800"
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-06-12T06:56:21.319Z"
 *       400:
 *         description: 입력 누락 등 잘못된 요청
 *       401:
 *         description: 인증되지 않은 사용자
 *       500:
 *         description: 서버 오류
 */

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
