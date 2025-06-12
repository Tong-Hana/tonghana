import { prisma } from "@/lib/prisma";
import { faker } from "@faker-js/faker/locale/ko";

async function dummyUserProduct() {
  const users = await prisma.user.findMany();
  for (const user of users) {
    const cnt = faker.number.int({ min: 1, max: 13 });
    for (let i = 0; i < cnt; i++) {
      const productNumber = faker.number.int({ min: 25, max: 124 });
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
}

async function main() {
  await dummyUserProduct()
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
main();
