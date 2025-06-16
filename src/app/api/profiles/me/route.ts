import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

// 내 정보 조회
export async function GET(req: NextRequest) {
  const user = await getAuthUser();
  if (!user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const profile = await prisma.user.findUnique({
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

    await prisma.user.update({
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
      await prisma.pairingAnswer.update({
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
