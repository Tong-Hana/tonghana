import { faker } from "@faker-js/faker/locale/ko";
import { User, Prisma } from "@prisma/client";
import { masterPrisma } from "../prisma/masterClient";

// 개별 유저의 지난달 소비 더미데이터 생성
export async function generateUserBadges(
  user: User,
  tx: Prisma.TransactionClient,
) {
  const maxBadgeCount = 3; // 배지 최대 개수
  await tx.userBadge.create({
    data: {
      userId: user.userId,
      diligent: faker.number.int({ min: 0, max: maxBadgeCount }),
      planner: faker.number.int({ min: 0, max: maxBadgeCount }),
      saver: faker.number.int({ min: 0, max: maxBadgeCount }),
      investor: faker.number.int({ min: 0, max: maxBadgeCount }),
    },
  });
}

// 모든 더미 유저의 지난달 소비 더미데이터 생성 : transaction으로 처리
export async function generateUserBadgesAll(users: User[]) {
  for (const user of users) {
    await masterPrisma.$transaction(async (tx) => {
      await generateUserBadges(user, tx);
    });
  }
}
