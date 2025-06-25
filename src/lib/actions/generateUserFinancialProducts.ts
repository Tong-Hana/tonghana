import { faker } from "@faker-js/faker/locale/ko";
import { User, Prisma } from "@prisma/client";
import { replicaPrisma } from "../prisma/replicaClient";
import { masterPrisma } from "../prisma/masterClient";

// 사용자별 금융상품 더미데이터 생성
export async function generateUserFinancialProducts(
  user: User,
  productPool: { productId: number; category: string }[],
  tx: Prisma.TransactionClient,
) {
  const minProductCnt = 1;
  const maxProductCnt = 13;
  const cnt = faker.number.int({ min: minProductCnt, max: maxProductCnt });

  for (let i = 0; i < cnt; i++) {
    // financialProduct에서 랜덤으로 상품을 선택하고 중복 제거
    const index = faker.number.int({ min: 0, max: productPool.length - 1 });
    // productPool[index] 위치에 있는 요소를 1개 삭제하고 삭제한 [0]번째 요소를 반환
    const { productId, category } = productPool.splice(index, 1)[0];

    let productEndDate: Date | null = null;
    if (category === "SAVINGS") {
      productEndDate = faker.date.soon({
        days: 365 * faker.number.int({ min: 1, max: 5 }),
      });
    }

    await tx.userFinancialProduct.create({
      data: {
        userId: user.userId,
        productId,
        currentValue: faker.number.int({ min: 100, max: 1000 }) * 10_000,
        productEndDate: productEndDate?.toISOString() || null,
      },
    });
  }
}

// 모든 더미 유저의 금융상품 더미데이터 생성 : transaction으로 처리
export async function generateUserFinancialProductsAll(users: User[]) {
  const financialProducts = await replicaPrisma.financialProduct.findMany({
    select: { productId: true, category: true },
  });

  await masterPrisma.$transaction(async (tx) => {
    for (const user of users) {
      const productPool = [...financialProducts];
      await generateUserFinancialProducts(user, productPool, tx);
    }
  });
}
