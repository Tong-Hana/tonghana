import { faker } from "@faker-js/faker/locale/ko";
import { User } from "@prisma/client";
import { masterPrisma } from "../prisma/masterClient";
import { replicaPrisma } from "../prisma/replicaClient";

// 개별 유저의 지난달 소비 더미데이터 생성
export async function generateUserConsume(user: User) {
  const total = 100;
  const savings = faker.number.int({ min: 1, max: total - 60 });
  const investment = faker.number.int({ min: 1, max: total - savings - 40 });
  const leisure = faker.number.int({
    min: 1,
    max: total - savings - investment - 20,
  });
  const fixed = faker.number.int({
    min: 1,
    max: total - savings - investment - leisure,
  });
  const etc = total - savings - investment - leisure - fixed;

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

// 모든 더미 유저의 지난달 소비 더미데이터 생성
export async function generateUserConsumeAll() {
  const users = await replicaPrisma.user.findMany();
  for (const user of users) {
    await generateUserConsume(user);
  }
}
