import { dummyFinancialProductAll } from "./dummyProduct";
import { dummyUserAll } from "./dummyUser";
import { dummyUserProductAll } from "../../src/lib/actions/dummyUserProduct";
import { dummyConsumeAll } from "../../src/lib/actions/dummyConsume";
import { createDummyLoanAll } from "../../src/lib/actions/createDummyLoan";
import { dummyPairAll } from "./dummyPair";
import { updateDummyUsersCurrentType } from "./updateCurrentType";
import { masterPrisma } from "../../src/lib/prisma/masterClient";

// 모든 더미 데이터를 생성하는 함수
async function main() {
  await dummyFinancialProductAll();
  await dummyUserAll();
  await dummyUserProductAll();
  await dummyConsumeAll();
  await createDummyLoanAll();
  await dummyPairAll();
  await updateDummyUsersCurrentType();
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
      await masterPrisma.$disconnect();
    });
}
