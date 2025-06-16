import { faker } from "@faker-js/faker/locale/ko";
import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";

export async function dummyConsume(user: User) {
  const total = 100;
  const a = faker.number.int({ min: 1, max: total - 60 });
  const b = faker.number.int({ min: 1, max: total - a - 40 });
  const c = faker.number.int({ min: 1, max: total - a - b - 20 });
  const d = faker.number.int({ min: 1, max: total - a - b - c });
  const e = total - a - b - c;
  const [savings, investment, leisure, fixed, etc] = [a, b, c, d, e].map(
    (v) => v,
  );
  await prisma.consumeHistory.create({
    data: {
      userId: user.userId,
      savingsRate: savings,
      investmentRate: investment,
      leisureRate: leisure,
      livingExpenseRate: fixed,
      otherRate: etc,
    },
  });
}
async function dummyConsumeAll() {
  const users = await prisma.user.findMany();
  for (const user of users) {
    await dummyConsume(user);
  }
}
async function main() {
  try {
    await dummyConsumeAll();
  } catch (error) {
    console.error("Error creating user:", error);
  } finally {
    await prisma.$disconnect();
  }
}
if (require.main === module) {
  main();
}
