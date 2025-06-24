/**
 * @swagger
 * /api/profiles/me:
 *   get:
 *     tags:
 *       - Profiles
 *     summary: 내 정보 조회 (마이페이지)
 *     description: 사용자 기본 정보, 지난달 소비 내역역, 가입한 금융상품 목록을 조회합니다.
 *     responses:
 *       200:
 *         description: 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: integer
 *                   example: 186
 *                 nickname:
 *                   type: string
 *                   example: "성수 카리나"
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
 *                 userFinancialProduct:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       userProductId:
 *                         type: integer
 *                         example: 1297
 *                       userId:
 *                         type: integer
 *                         example: 186
 *                       productId:
 *                         type: integer
 *                         example: 73
 *                       currentValue:
 *                         type: string
 *                         example: "6000000"
 *                       productEndDate:
 *                         type: string
 *                         format: date-time
 *                         nullable: true
 *                         example: "2028-02-16T16:31:25.447Z"
 *                       financialProduct:
 *                         type: object
 *                         properties:
 *                           productId:
 *                             type: integer
 *                             example: 73
 *                           productName:
 *                             type: string
 *                             example: "기업은행 자유적립 적금"
 *                           institutionName:
 *                             type: string
 *                             example: "기업은행"
 *                           riskLevel:
 *                             type: string
 *                             example: "VERY_LOW"
 *                           category:
 *                             type: string
 *                             example: "SAVINGS"
 *       401:
 *         description: 인증 실패
 *       500:
 *         description: 서버 오류

 *   patch:
 *     tags:
 *       - Profiles
 *     summary: 내 정보 수정
 *     description: 사용자 프로필 정보 및 페어링북 답변을 일부 혹은 전체 수정합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               nickname: "성수 카리나"
 *               description: "성수 살아요."
 *               pairingAnswer:
 *                 carBudget: 15000000
 *                 preferredCity: "서울시 강남구"
 *     responses:
 *       200:
 *         description: 수정 완료
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "수정 완료"
 *       401:
 *         description: 인증 실패
 *       500:
 *         description: 서버 오류
 */

import { getAuthUser } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { replicaPrisma } from "@/lib/prisma/replicaClient";
import { masterPrisma } from "@/lib/prisma/masterClient";

// 내 정보 조회
export async function GET(req: NextRequest) {
  const user = await getAuthUser();
  if (!user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const profile = await replicaPrisma.user.findUnique({
      where: { userId: user.userId },
      select: {
        userId: true,
        nickname: true,
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
        userFinancialProduct: {
          select: {
            userProductId: true,
            userId: true,
            productId: true,
            currentValue: true,
            productEndDate: true,
            financialProduct: {
              select: {
                productId: true,
                productName: true,
                institutionName: true,
                riskLevel: true,
                category: true,
              },
            },
          },
        },
      },
    });

    const serializedProfile = {
      ...profile,
      userFinancialProduct: profile?.userFinancialProduct?.map((p) => ({
        ...p,
        currentValue: p.currentValue.toString(), // BigInt → String
        productEndDate: p.productEndDate,
        financialProduct: p.financialProduct,
      })),
    };

    return NextResponse.json(serializedProfile, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}

// 내 정보 수정
export async function PATCH(req: NextRequest) {
  const user = await getAuthUser();
  if (!user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();

    const {
      nickname,
      job,
      goalAmount,
      goalPeriod,
      goalType,
      description,
      profileImage,
      hasCar,
      carValue,
      hasHouse,
      houseValue,
      city,
      pairingAnswer,
    } = body;

    await masterPrisma.user.update({
      where: { userId: user.userId },
      data: {
        ...(nickname && { nickname }),
        ...(job && { job }),
        ...(goalAmount !== undefined && { goalAmount }),
        ...(goalPeriod && { goalPeriod }),
        ...(goalType && { goalType }),
        ...(description && { description }),
        ...(profileImage && { profileImage }),
        ...(hasCar !== undefined && { hasCar }),
        ...(carValue !== undefined && { carValue }),
        ...(hasHouse !== undefined && { hasHouse }),
        ...(houseValue !== undefined && { houseValue }),
        ...(city && { city }),
      },
    });

    if (pairingAnswer) {
      await masterPrisma.pairingAnswer.update({
        where: { userId: user.userId },
        data: {
          ...(pairingAnswer.carBudget !== undefined && {
            carBudget: BigInt(pairingAnswer.carBudget),
          }),
          ...(pairingAnswer.dateBudget !== undefined && {
            dateBudget: pairingAnswer.dateBudget,
          }),
          ...(pairingAnswer.shoesBudget !== undefined && {
            shoesBudget: pairingAnswer.shoesBudget,
          }),
          ...(pairingAnswer.preferredCity && {
            preferredCity: pairingAnswer.preferredCity,
          }),
          ...(pairingAnswer.idealIncomeRange && {
            idealIncomeRange: pairingAnswer.idealIncomeRange,
          }),
        },
      });
    }

    return NextResponse.json({ message: "수정 완료" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}
