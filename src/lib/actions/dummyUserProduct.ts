import { faker } from "@faker-js/faker/locale/ko";
import { User } from "@prisma/client";
import { replicaPrisma } from "../prisma/replicaClient";
import { masterPrisma } from "../prisma/masterClient";

export async function dummyUserProduct(
  user: User,
  minId: number = 0,
  maxId: number = 0,
) {
  const minProductCnt = 1;
  const maxProductCnt = 13;
  const cnt = faker.number.int({ min: minProductCnt, max: maxProductCnt });
  if (minId === 0 || maxId === 0) {
    const result = await replicaPrisma.financialProduct.aggregate({
      _min: {
        productId: true,
      },
      _max: {
        productId: true,
      },
    });
    minId = result?._min.productId || 0;
    maxId = result?._max.productId || 1;
  }
  for (let i = 0; i < cnt; i++) {
    const productNumber = faker.number.int({ min: minId, max: maxId });
    const product = await replicaPrisma.financialProduct.findUnique({
      where: { productId: productNumber },
    });
    let productEndDate: Date | null = null;
    if (product && product.category === "SAVINGS") {
      productEndDate = faker.date.soon({
        days: 365 * faker.number.int({ min: 1, max: 5 }),
      });
    }
    if (!product) {
      console.warn(`Product with ID ${productNumber} not found.`);
      continue;
    }
    await masterPrisma.userFinancialProduct.create({
      data: {
        userId: user.userId,
        productId: product.productId,
        currentValue:
          Math.floor(
            faker.number.int({ min: 1_000_000, max: 10_000_000 }) / 1_000_000,
          ) * 1_000_000,
        productEndDate: productEndDate?.toISOString() || null,
      },
    });
  }
}

// 유저가 소유한 금융상품 더미데이터 생성
export async function dummyUserProductAll() {
  const users = await replicaPrisma.user.findMany();
  const result = await replicaPrisma.financialProduct.aggregate({
    _min: {
      productId: true,
    },
    _max: {
      productId: true,
    },
  });

  const minId = result?._min.productId || 0;
  const maxId = result?._max.productId || 1;
  for (const user of users) {
    await dummyUserProduct(user, minId, maxId);
  }
}
