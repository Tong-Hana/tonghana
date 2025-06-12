import { faker } from "@faker-js/faker/locale/ko";
import { prisma } from "@/lib/prisma";

async function dummyConsume() {
  const users = await prisma.user.findMany();
  users.forEach(async (user) => {
    const total = 100;
    const a = faker.number.int({ min: 1, max: total - 60 });
    const b = faker.number.int({ min: 1, max: total - a - 40 });
    const c = faker.number.int({ min: 1, max: total - a - b - 20 });
    const d = faker.number.int({ min: 1, max: total - a - b - c });
    const e = total - a - b - c;
    const [savings, investment, leisure, fixed, etc] = [a, b, c, d, e].map(
      (v) => v,
    );
    console.log(
      `User: ${user.userId}, Savings: ${savings}, Investment: ${investment}, Leisure: ${leisure}, Fixed Expense: ${fixed} Etc: ${etc}`,
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
  });
}
async function main() {
  try {
    await dummyConsume();
  } catch (error) {
    console.error("Error creating user:", error);
  } finally {
    await prisma.$disconnect(); // 연결 종료를 반드시 보장
  }
}
main();
