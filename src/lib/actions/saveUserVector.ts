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
export const saveDummyUserVector = async (userInPrisma: User) => {
  if (!userInPrisma.preferredType) {
    return;
  }
  const oppositeGender = userInPrisma.gender === "M" ? "F" : "M";
  const user: UserProfile = {
    userId: userInPrisma.userId,
    gender: userInPrisma.gender,
    preferredGender: oppositeGender,
    currentInvestmentType: userInPrisma.currentType as InvestmentType,
    preferredInvestmentType: userInPrisma.preferredType as InvestmentType,
  };
  const vector = investmentTypeToVector(
    userInPrisma.currentType as InvestmentType,
  );
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
};

export const saveUserVector = async (userInPrisma: User) => {
  if (!userInPrisma.gender) {
    return;
  }
  const oppositeGender = userInPrisma.gender === "M" ? "F" : "M";
  await client.data
    .creator()
    .withClassName("User")
    .withProperties({
      userId: userInPrisma.userId,
      gender: userInPrisma.gender,
      preferredGender: oppositeGender,
    })
    .do();
};

export const updateUserCurrentVector = async (userInPrisma: User) => {
  if (!userInPrisma.currentType) {
    return;
  }
  const result = await client.graphql
    .get()
    .withClassName("User")
    .withFields(
      `
    userId
    gender
    preferredGender
    currentType
    preferredType
    currentVector
    _additional {
      id
      vector
    }
  `,
    )
    .withWhere({
      path: ["userId"],
      operator: "Equal",
      valueNumber: Number(userInPrisma.userId),
    })
    .do();
  const userObj = result.data.Get.User[0];
  if (!userObj) throw new Error("User not found in Weaviate");
  const { _additional, ...existingProperties } = userObj;
  const vector = investmentTypeToVector(
    userInPrisma.currentType as InvestmentType,
  );
  await client.data
    .updater()
    .withClassName("User")
    .withId(_additional.id)
    .withProperties(existingProperties)
    .withVector(vector)
    .do();
};

export const updateUserPreferredVector = async (userInPrisma: User) => {
  if (!userInPrisma.preferredType) {
    return;
  }
  const result = await client.graphql
    .get()
    .withClassName("User")
    .withFields("_additional { id }")
    .withWhere({
      path: ["userId"],
      operator: "Equal",
      valueNumber: userInPrisma.userId,
    })
    .do();
  const weaviateId = result.data.Get.User[0]?._additional?.id;
  if (!weaviateId) throw new Error("User not found in Weaviate");
  await client.data
    .merger()
    .withClassName("User")
    .withId(weaviateId)
    .withProperties({
      preferredType: userInPrisma.preferredType,
    })
    .do();
};
