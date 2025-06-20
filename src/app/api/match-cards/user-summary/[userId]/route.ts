/**
 * @swagger
 * /api/match-cards/user-summary/{userId}:
 *   get:
 *     summary: 유저 카드 상세 정보 조회
 *     description: |
 *       지정한 유저 ID 또는 me 에 대한 카드 상세 정보를 조회합니다.  
 *       응답에는 사용자 기본 정보, 페어링북, 지난달 소비내역 비율,  
 *       금융상품 및 대출 비율, 금융 카테고리별 비율이 포함됩니다.

 *       자산 정보 공개 조건:
 *       - 마이페이지에서 본인 카드 상세보기 (userId가 "me"일 경우)
 *       - 채팅방에서 자산 공개에 서로 동의한 경우 (isAgree && isAgree2)

 *       위 조건 중 하나라도 충족하면 다음 항목이 포함됩니다:
 *       - carValue: 자동차 자산 금액
 *       - houseValue: 부동산 자산 금액
 *       - goalAmount: 목표 금액
 *       - totalAsset: 총 자산 (금융상품 + 자동차 + 부동산)

 *       비율 관련 정보:
 *       - consumeHistory: 지난달 소비내역 항목별 비율 (소수점 2자리, 합계 ≒ 1)
 *       - categoryRatios: 금융상품 카테고리별 비율 (소수점 2자리, 마지막 항목 보정으로 합계 = 1)
 *     tags:
 *       - MatchCards
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: 사용자 ID 또는 "me"
 *     responses:
 *       200:
 *         description: 유저 카드 상세 정보 반환 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 상황별 응답 메시지
 *                   example: "상대방과 자산 공개에 동의하여 자산 정보를 포함해 반환했습니다."
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: integer
 *                     nickname:
 *                       type: string
 *                     gender:
 *                       type: string
 *                     birthYear:
 *                       type: integer
 *                     city:
 *                       type: string
 *                     job:
 *                       type: string
 *                     description:
 *                       type: string
 *                     profileImage:
 *                       type: string
 *                     hasCar:
 *                       type: boolean
 *                     hasHouse:
 *                       type: boolean
 *                     carValue:
 *                       type: integer
 *                       nullable: true
 *                     houseValue:
 *                       type: integer
 *                       nullable: true
 *                     goalAmount:
 *                       type: integer
 *                       nullable: true
 *                     totalAsset:
 *                       type: integer
 *                       nullable: true
 *                     goalPeriod:
 *                       type: string
 *                     goalType:
 *                       type: string
 *                     currentType:
 *                       type: string
 *                     preferredType:
 *                       type: string
 *                     pairingAnswer:
 *                       type: object
 *                       properties:
 *                         carBudget:
 *                           type: integer
 *                         dateBudget:
 *                           type: integer
 *                         shoesBudget:
 *                           type: integer
 *                         preferredCity:
 *                           type: string
 *                         idealIncomeRange:
 *                           type: string
 *                     consumeHistory:
 *                       type: object
 *                       description: 지난달 소비 항목별 비율 (소수점 2자리, 합계 ≒ 1)
 *                       properties:
 *                         savingsRate:
 *                           type: number
 *                           example: 0.28
 *                         investmentRate:
 *                           type: number
 *                           example: 0.25
 *                         leisureRate:
 *                           type: number
 *                           example: 0.15
 *                         livingExpenseRate:
 *                           type: number
 *                           example: 0.2
 *                         otherRate:
 *                           type: number
 *                           example: 0.12
 *                     financialProductRatio:
 *                       type: object
 *                       description: 전체 금융 자산 대비 비율
 *                       properties:
 *                         financeRatio:
 *                           type: number
 *                           example: 0.6
 *                         loanRatio:
 *                           type: number
 *                           example: 0.4
 *                     categoryRatios:
 *                       type: object
 *                       description: 금융상품 카테고리별 비율 (소수점 2자리, 보정 포함, 합계 = 1)
 *                       additionalProperties:
 *                         type: number
 *                         example: 0.35
 *       401:
 *         description: 인증되지 않은 사용자
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "인증된 사용자가 아닙니다."
 *       404:
 *         description: 사용자를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "사용자를 찾을 수 없습니다."
 *       500:
 *         description: 서버 내부 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "서버 내부 오류가 발생했습니다."
 */

import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ userId: string }> },
) {
  const authUser = await getAuthUser();
  const { userId } = await context.params;

  // 'me'일 경우 본인 정보로 판단
  const isMe = userId === "me";
  const targetUserId = isMe ? authUser?.userId : parseInt(userId, 10);
  const authUserId = authUser?.userId;

  if (!targetUserId) {
    return NextResponse.json(
      { message: "인증된 사용자가 아닙니다." },
      { status: 401 },
    );
  }

  try {
    // 유저 정보 + 채팅방 정보 동시 조회
    const [userData, chatRoom] = await Promise.all([
      // 유저 프로필 및 소비 성향 정보 조회
      prisma.user.findUnique({
        where: { userId: targetUserId },
        select: {
          userId: true,
          nickname: true,
          gender: true,
          birthYear: true,
          city: true,
          job: true,
          description: true,
          profileImage: true,
          hasCar: true,
          hasHouse: true,
          carValue: true,
          houseValue: true,
          goalAmount: true,
          goalPeriod: true,
          goalType: true,
          currentType: true,
          preferredType: true,
          pairingAnswer: {
            select: {
              carBudget: true,
              dateBudget: true,
              shoesBudget: true,
              preferredCity: true,
              idealIncomeRange: true,
            },
          },
          consumeHistory: {
            select: {
              savingsRate: true,
              investmentRate: true,
              leisureRate: true,
              livingExpenseRate: true,
              otherRate: true,
            },
          },
        },
      }),

      // 상대방 정보일 경우, 둘 간의 채팅방이 존재하는지 확인 (자산 공개 여부 판단용)
      !isMe && authUserId
        ? prisma.chatRoom.findFirst({
            where: {
              OR: [
                { userId: authUserId, userId2: targetUserId },
                { userId: targetUserId, userId2: authUserId },
              ],
            },
            select: {
              isAgree: true,
              isAgree2: true,
            },
          })
        : null,
    ]);

    if (!userData) {
      return NextResponse.json(
        { message: "사용자를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    // 자산 정보를 보여줄지 여부: 본인이거나 둘 다 동의한 채팅방이 있을 경우
    const showAssetValues = isMe || (chatRoom?.isAgree && chatRoom?.isAgree2);

    // 금융상품 및 대출 정보 조회
    const [products, loans] = await Promise.all([
      prisma.userFinancialProduct.findMany({
        where: { userId: targetUserId },
        select: {
          currentValue: true,
          financialProduct: {
            select: {
              category: true,
              productName: true,
              institutionName: true,
              riskLevel: true,
            },
          },
        },
      }),
      prisma.loan.findMany({
        where: { userId: targetUserId },
        select: {
          loanBalance: true,
        },
      }),
    ]);

    // 전체 대출 총액 계산
    const loanTotal = loans.reduce(
      (acc, loan) => acc + Number(loan.loanBalance ?? 0),
      0,
    );

    // 금융자산 합계 및 카테고리별 금액 합계
    const categorySums: Record<string, number> = {};
    let financeTotal = 0;

    for (const p of products) {
      const { category } = p.financialProduct;
      const value = Number(p.currentValue ?? 0);
      if (category === "LOAN") continue; // 대출 상품은 금융자산에서 제외

      financeTotal += value;
      categorySums[category] = (categorySums[category] ?? 0) + value;
    }

    // 금융자산 + 대출 총합 (0 방지용 fallback 1)
    const totalValue = financeTotal + loanTotal || 1;

    // 카테고리별 자산 비율 계산
    // categorySums → categoryRatios 변환 (소수점 2자리 + 마지막 항목 보정)
    const entries = Object.entries(categorySums).map(([key, value]) => {
      const ratio = parseFloat((value / financeTotal).toFixed(2));
      return { key, ratio };
    });

    // 합산 후 마지막 항목에 보정
    let sum = entries.reduce((acc, { ratio }) => acc + ratio, 0);
    const diff = parseFloat((1 - sum).toFixed(2));
    if (entries.length > 0) {
      entries[entries.length - 1].ratio = parseFloat(
        (entries[entries.length - 1].ratio + diff).toFixed(2),
      );
    }

    // 객체로 변환
    const categoryRatios = Object.fromEntries(
      entries.map(({ key, ratio }) => [key, ratio]),
    );

    // 총자산 = 자동차 + 부동산 + 금융자산 (단, showAssetValues 조건 충족 시에만 계산)
    const assetTotal = showAssetValues
      ? Number(userData.carValue ?? 0) +
        Number(userData.houseValue ?? 0) +
        financeTotal
      : null;

    // 소비 히스토리 비율 계산
    const ch = userData.consumeHistory;

    // 각 항목 Decimal → number로 변환
    const savings = ch?.savingsRate?.toNumber?.() ?? 0;
    const investment = ch?.investmentRate?.toNumber?.() ?? 0;
    const leisure = ch?.leisureRate?.toNumber?.() ?? 0;
    const living = ch?.livingExpenseRate?.toNumber?.() ?? 0;
    const other = ch?.otherRate?.toNumber?.() ?? 0;

    // 총합 계산
    const consumeTotal = savings + investment + leisure + living + other;

    // 총합이 0일 경우 각 비율은 0 처리, 아니면 소수점 3자리 비율 계산
    const consumeRatios =
      consumeTotal > 0
        ? {
            savingsRate: parseFloat((savings / consumeTotal).toFixed(2)),
            investmentRate: parseFloat((investment / consumeTotal).toFixed(2)),
            leisureRate: parseFloat((leisure / consumeTotal).toFixed(2)),
            livingExpenseRate: parseFloat((living / consumeTotal).toFixed(2)),
            otherRate: parseFloat((other / consumeTotal).toFixed(2)),
          }
        : {
            savingsRate: 0,
            investmentRate: 0,
            leisureRate: 0,
            livingExpenseRate: 0,
            otherRate: 0,
          };

    // 최종 결과 객체 조립
    const result = {
      ...userData,
      carValue: showAssetValues ? Number(userData.carValue ?? 0) : null,
      houseValue: showAssetValues ? Number(userData.houseValue ?? 0) : null,
      goalAmount: showAssetValues ? Number(userData.goalAmount ?? 0) : null,
      totalAsset: showAssetValues ? assetTotal : null,
      financialProductRatio: {
        financeRatio: parseFloat((financeTotal / totalValue).toFixed(2)),
        loanRatio: parseFloat((loanTotal / totalValue).toFixed(2)),
      },
      categoryRatios,
      consumeHistory: consumeRatios,
    };

    // BigInt 에러 방지용 JSON 변환
    const serialized = JSON.parse(
      JSON.stringify(result, (_, value) =>
        typeof value === "bigint" ? Number(value) : value,
      ),
    );

    // 메시지 분기
    const message = isMe
      ? "내 카드 정보를 성공적으로 반환했습니다."
      : chatRoom?.isAgree && chatRoom?.isAgree2
        ? "상대방과 자산 공개에 동의하여 자산 정보를 포함해 반환했습니다."
        : "상대방 카드 정보를 자산 없이 반환했습니다.";

    return NextResponse.json({ message, data: serialized });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "서버 내부 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
