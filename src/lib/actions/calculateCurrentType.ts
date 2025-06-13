import { prisma } from "@/lib/prisma";
import { RiskLevel } from "@/lib/constants/enums";
import { InvestmentType } from "@/lib/constants/enums";

function getInvestmentType(userWeightedLevel: number): InvestmentType {
  if (userWeightedLevel <= 1.5) return InvestmentType.VERY_AGGRESSIVE;
  if (userWeightedLevel <= 3) return InvestmentType.AGGRESSIVE;
  if (userWeightedLevel <= 4) return InvestmentType.NEUTRAL;
  if (userWeightedLevel <= 5) return InvestmentType.MODERATE;
  return InvestmentType.CONSERVATIVE;
}

export async function calculateCurrentType(userId: number) {
  const financialProducts = await prisma.userFinancialProduct.findMany({
    where: { userId: userId },
    include: {
      financialProduct: {
        select: {
          riskLevel: true,
        },
      },
    },
  });

  const data: Record<RiskLevel, number> = {
    VERY_LOW: 0,
    LOW: 0,
    MEDIUM: 0,
    LITTLE_HIGH: 0,
    HIGH: 0,
    VERY_HIGH: 0,
  };

  const riskLevelValues: Record<RiskLevel, number> = {
    VERY_LOW: 6,
    LOW: 5,
    MEDIUM: 4,
    LITTLE_HIGH: 3,
    HIGH: 2,
    VERY_HIGH: 1,
  };
  let sum = 0;
  if (financialProducts) {
    for (const product of financialProducts) {
      if (product.currentValue) {
        sum += Number(product.currentValue);
        if (product.financialProduct.riskLevel) {
          data[product.financialProduct.riskLevel as RiskLevel] += Number(
            product.currentValue,
          );
        }
      }
    }
    let score = 0;
    (Object.keys(data) as Array<keyof typeof data>).forEach(
      (key: RiskLevel) => {
        score +=
          (Math.round((data[key] / sum) * 10000) / 100) *
          (riskLevelValues[key] / 100);
      },
    );

    const userWeightedType = getInvestmentType(score);
    await prisma.user.update({
      where: { userId: userId },
      data: {
        currentType: userWeightedType,
      },
    });
  }
}
