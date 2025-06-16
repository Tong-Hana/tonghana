import { faker } from "@faker-js/faker/locale/ko";
import { prisma } from "@/lib/prisma";
import { IdealIncomeRange } from "../constants/enums";

async function dummyPair() {
  let minValue = 10000000;
  const users = await prisma.user.findMany();
  for (const user of users) {
    if (user.hasCar) {
      minValue = Number(user.carValue);
    }
    await prisma.pairingAnswer.create({
      data: {
        userId: user.userId,
        carBudget:
          Math.floor(
            faker.number.int({ min: minValue, max: 200000000 }) / 1_000_000,
          ) * 1_000_000,
        dateBudget: faker.number.int({ min: 10, max: 100 }),
        shoesBudget: faker.number.int({ min: 10, max: 100 }),
        preferredCity: user.city,
        idealIncomeRange: faker.helpers.arrayElement([
          IdealIncomeRange.NEAR_400,
          IdealIncomeRange.NEAR_600,
          IdealIncomeRange.NEAR_800,
          IdealIncomeRange.OVER_1000,
        ]),
        createdAt: new Date().toISOString(),
      },
    });
  }
}
// 더미데이터 생성
async function main() {
  await dummyPair()
    .then(() => {
      console.log("Dummy pairing data created successfully.");
    })
    .catch((error) => {
      console.error("Error creating dummy pairing data:", error);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
if (require.main === module) {
  main();
}
