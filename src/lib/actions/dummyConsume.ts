import { faker } from "@faker-js/faker/locale/ko";
import { User } from "@prisma/client";
import { masterPrisma } from "../prisma/masterClient";
import { replicaPrisma } from "../prisma/replicaClient";

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
  await masterPrisma.consumeHistory.create({
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

// 유저의 소비 더미데이터 생성
export async function dummyConsumeAll() {
  const users = await replicaPrisma.user.findMany();
  for (const user of users) {
    await dummyConsume(user);
  }
}
