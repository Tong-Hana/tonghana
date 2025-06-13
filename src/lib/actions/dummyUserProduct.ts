import { prisma } from "@/lib/prisma";
import { faker } from "@faker-js/faker/locale/ko";
import { User } from "@prisma/client";

export async function dummyUserProduct(
  user: User,
  minId: number = 0,
  maxId: number = 0,
) {
  const minProductCnt = 1;
  const maxProductCnt = 13;
  const cnt = faker.number.int({ min: minProductCnt, max: maxProductCnt });
  if (minId === 0 || maxId === 0) {
    const result = await prisma.financialProduct.aggregate({
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
    const product = await prisma.financialProduct.findUnique({
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
    await prisma.userFinancialProduct.create({
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

async function makeAllUserProducts() {
  const users = await prisma.user.findMany();
  const result = await prisma.financialProduct.aggregate({
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
// 더미데이터 생성
async function main() {
  await makeAllUserProducts()
    .then(() => {
      console.log("Dummy data created successfully.");
    })
    .catch((error) => {
      console.error("Error creating dummy data:", error);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
if (require.main === module) {
  main();
}
