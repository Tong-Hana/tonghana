import { faker } from "@faker-js/faker/locale/ko";
import { User, Prisma } from "@prisma/client";
import { masterPrisma } from "../prisma/masterClient";

// 개별 유저의 지난달 소비 더미데이터 생성
export async function generateUserConsume(
  user: User,
  tx: Prisma.TransactionClient,
) {
  const total = 100;
  const savings = faker.number.int({ min: 1, max: total - 60 });
  const investment = faker.number.int({
    min: 1,
    max: Math.max(1, total - savings - 40),
  });
  const leisure = faker.number.int({
    min: 1,
    max: Math.max(1, total - savings - investment - 20),
  });
  const fixed = faker.number.int({
    min: 1,
    max: Math.max(1, total - savings - investment - leisure),
  });
  const etc = total - savings - investment - leisure - fixed;

  await tx.consumeHistory.create({
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

// 모든 더미 유저의 지난달 소비 더미데이터 생성 : transaction으로 처리
export async function generateUserConsumeAll(users: User[]) {
  for (const user of users) {
    await masterPrisma.$transaction(async (tx) => {
      await generateUserConsume(user, tx);
    });
  }
}
