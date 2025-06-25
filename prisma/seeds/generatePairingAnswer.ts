// 더미 유저의 페어링 답변 더미데이터 생성함수

import { faker } from "@faker-js/faker/locale/ko";
import { IdealIncomeRange } from "../../src/lib/constants/enums";
import { REGIONS } from "../../src/constants/regions";
import { masterPrisma } from "../../src/lib/prisma/masterClient";
import { replicaPrisma } from "../../src/lib/prisma/replicaClient";

function getPreferredCity(currentCity: string): string {
  const [state] = currentCity.split(" "); // "서울시 성동구" -> ["서울시", "성동구"]
  const cities = REGIONS[state]; // 서울시
  const randomCity = faker.helpers.arrayElement(cities); // 군/구 랜덤 선택

  return `${state} ${randomCity}`; // "서울시 랜덤구"
}

async function createPairingAnswer(user) {
  await masterPrisma.pairingAnswer.create({
    data: {
      userId: user.userId,
      carBudget: faker.number.int({ min: 10, max: 200 }) * 1_000_000,
      dateBudget: faker.number.int({ min: 10, max: 100 }) * 10_000,
      shoesBudget: faker.number.int({ min: 10, max: 100 }) * 10_000,
      preferredCity: getPreferredCity(user.city),
      idealIncomeRange: faker.helpers.arrayElement([
        IdealIncomeRange.NEAR_400,
        IdealIncomeRange.NEAR_600,
        IdealIncomeRange.NEAR_800,
        IdealIncomeRange.OVER_1000,
      ]),
    },
  });
}

export async function generateUserPairingAnswers() {
  const users = await replicaPrisma.user.findMany({
    select: { userId: true, city: true },
  });

  for (const user of users) {
    await createPairingAnswer(user);
  }
}
