import { dummyFinancialProductAll } from "@/lib/actions/dummyProduct";
import { prisma } from "@/lib/prisma";
import { dummyUserAll } from "@/lib/actions/dummyUser";
import { dummyUserProductAll } from "@/lib/actions/dummyUserProduct";
import { dummyConsumeAll } from "@/lib/actions/dummyConsume";
import { dummyLoanAll } from "@/lib/actions/dummyLoan";
import { dummyPairAll } from "@/lib/actions/dummyPair";
import { updateAllUsersCurrentType } from "@/lib/actions/calculateCurrentType";

// 모든 더미 데이터를 생성하는 함수
async function main() {
  await dummyFinancialProductAll();
  await dummyUserAll();
  await dummyUserProductAll();
  await dummyConsumeAll();
  await dummyLoanAll();
  await dummyPairAll();
  await updateAllUsersCurrentType();
}

if (require.main === module) {
  main()
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
