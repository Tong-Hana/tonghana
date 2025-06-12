import { faker } from "@faker-js/faker/locale/ko";
import { prisma } from "@/lib/prisma";

async function dummyPair() {
  let minValue = 10000000;
  const users = await prisma.user.findMany();
  users.forEach(async (user) => {
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
          "NEAR_400",
          "NEAR_600",
          "NEAR_800",
          "OVER_1000",
        ]),
        createdAt: new Date().toISOString(),
      },
    });
  });
}
async function main() {
  await dummyPair()
    .then(() => {
      console.log("Dummy pairing data created successfully.");
    })
    .catch((error) => {
      console.error("Error creating dummy pairing data:", error);
    })
    .finally(async () => {
      await prisma.$disconnect(); // Ensure the connection is closed
    });
}
main();
