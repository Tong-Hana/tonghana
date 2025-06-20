import { InvestmentType } from "@/lib/constants/enums";
import { client } from "@/lib/weaviate";
import { UserProfile } from "@/lib/definiitons";
import { User } from "@prisma/client";

const centers = {
  CONSERVATIVE: 0,
  MODERATE: 1,
  NEUTRAL: 2,
  AGGRESSIVE: 3,
  VERY_AGGRESSIVE: 4,
};

const dimensionCount = 5;
const sigma = 1; // 가우시안 폭, 조절 가능

function gaussian(x: number, mean: number, sigma: number): number {
  return Math.exp(-Math.pow(x - mean, 2) / (2 * sigma * sigma));
}

export const investmentTypeToVector = (type: InvestmentType): number[] => {
  const center = centers[type] ?? 2;
  const vector = [];

  for (let i = 0; i < dimensionCount; i++) {
    vector.push(gaussian(i, center, sigma));
  }

  return vector;
};

// 사용자 벡터를 Weaviate에 저장하는 함수
export const saveUserVector = async (userInPrisma: User) => {
  const oppositeGender = userInPrisma.gender === "M" ? "F" : "M";
  const user: UserProfile = {
    userId: userInPrisma.userId,
    gender: userInPrisma.gender,
    preferredGender: oppositeGender,
    currentInvestmentType: userInPrisma.currentType as InvestmentType,
    preferredInvestmentType: userInPrisma.preferredType as InvestmentType,
  };
  const vector = investmentTypeToVector(user.currentInvestmentType);
  await client.data
    .creator()
    .withClassName("User")
    .withProperties({
      userId: user.userId,
      gender: user.gender,
      preferredGender: user.preferredGender,
      currentType: user.currentInvestmentType,
      preferredType: user.preferredInvestmentType,
    })
    .withVector(vector)
    .do();
  console.log(`✅ Uploaded user ${user.userId} to Weaviate`);
};
