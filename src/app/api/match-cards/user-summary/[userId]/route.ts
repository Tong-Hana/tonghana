/**
 * @swagger
 * /api/match-cards/user-summary/{userId}:
 *   get:
 *     summary: 유저 카드 요약 정보 조회
 *     description: |
 *       특정 유저의 카드 보기 데이터를 조회합니다.
 *       유저 기본 정보, 페어링북 답변, 소비 성향(ConsumeHistory)을 포함합니다.
 *       userId에 "me"를 입력하면 로그인한 본인의 정보를 조회합니다.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: "조회할 유저의 ID (예: 'me' 또는 숫자 ID)"
 *     responses:
 *       200:
 *         description: 유저 카드 정보 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: integer
 *                   example: 186
 *                 birthYear:
 *                   type: integer
 *                   example: 2000
 *                 carValue:
 *                   type: integer
 *                   example: 12000000
 *                 city:
 *                   type: string
 *                   example: "서울시 동작구"
 *                 currentType:
 *                   type: string
 *                   example: "AGGRESSIVE"
 *                 description:
 *                   type: string
 *                   example: "안녕하세요! "
 *                 gender:
 *                   type: string
 *                   example: "M"
 *                 goalAmount:
 *                   type: integer
 *                   example: 50000000
 *                 goalPeriod:
 *                   type: string
 *                   example: "WITHIN_3_YEARS"
 *                 goalType:
 *                   type: string
 *                   example: "HOUSE"
 *                 hasCar:
 *                   type: boolean
 *                   example: true
 *                 hasHouse:
 *                   type: boolean
 *                   example: false
 *                 houseValue:
 *                   type: integer
 *                   nullable: true
 *                   example: null
 *                 job:
 *                   type: string
 *                   example: "백엔드 개발자"
 *                 nickname:
 *                   type: string
 *                   example: "테스트"
 *                 preferredType:
 *                   type: string
 *                   example: "NEUTRAL"
 *                 profileImage:
 *                   type: string
 *                   format: uri
 *                   example: "https://tonghanabucket.s3.ap-northeast-2.amazonaws.com/9ca111f8-f98c-44a1-97e8-bab8c00b1edd.jpeg"
 *                 pairingAnswer:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: integer
 *                       example: 186
 *                     carBudget:
 *                       type: integer
 *                       example: 133000000
 *                     dateBudget:
 *                       type: integer
 *                       example: 79
 *                     shoesBudget:
 *                       type: integer
 *                       example: 34
 *                     preferredCity:
 *                       type: string
 *                       example: "서울시 동작구"
 *                     idealIncomeRange:
 *                       type: string
 *                       example: "NEAR_800"
 *                 consumeHistory:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: integer
 *                       example: 186
 *                     savingsRate:
 *                       type: string
 *                       example: "9"
 *                     investmentRate:
 *                       type: string
 *                       example: "15"
 *                     leisureRate:
 *                       type: string
 *                       example: "36"
 *                     livingExpenseRate:
 *                       type: string
 *                       example: "16"
 *                     otherRate:
 *                       type: string
 *                       example: "40"
 *       400:
 *         description: 잘못된 요청
 *       401:
 *         description: 인증되지 않음
 *       404:
 *         description: 유저를 찾을 수 없음
 *       500:
 *         description: 서버 내부 오류
 */

import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(_: Request, context: { params: { userId: string } }) {
  const authUser = await getAuthUser();
  const { userId } = context.params;

  const targetUserId =
    userId === "me" ? authUser?.userId : parseInt(userId, 10);

  if (!targetUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userData = await prisma.user.findUnique({
      where: { userId: targetUserId },
      select: {
        userId: true,
        birthYear: true,
        carValue: true,
        city: true,
        currentType: true,
        description: true,
        gender: true,
        goalAmount: true,
        goalPeriod: true,
        goalType: true,
        hasCar: true,
        hasHouse: true,
        houseValue: true,
        job: true,
        nickname: true,
        preferredType: true,
        profileImage: true,
        pairingAnswer: {
          select: {
            userId: true,
            carBudget: true,
            dateBudget: true,
            shoesBudget: true,
            preferredCity: true,
            idealIncomeRange: true,
          },
        },
        consumeHistory: {
          select: {
            userId: true,
            savingsRate: true,
            investmentRate: true,
            leisureRate: true,
            livingExpenseRate: true,
            otherRate: true,
          },
        },
      },
    });

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // BigInt → Number로 변환 (예: carValue, houseValue, goalAmount 등)
    const serialized = JSON.parse(
      JSON.stringify(userData, (_, value) =>
        typeof value === "bigint" ? Number(value) : value,
      ),
    );

    return NextResponse.json(serialized);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
