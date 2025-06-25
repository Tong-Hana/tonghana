import { masterPrisma } from "../src/lib/prisma/masterClient";
import {
  createDepositSeed,
  createSavingSeed,
  createCommonSeed,
  createLoanSeed,
} from "./seeds/subjectQuiz";
import { generateFinancialProducts } from "./seeds/generateFinancialProducts";
import { generateUsers } from "./seeds/generateUsers";
import { generateUserFinancialProductsAll } from "../src/lib/actions/generateUserFinancialProducts";
import { generateUserLoanAll } from "../src/lib/actions/generateUserLoan";
import { generateUserConsumeAll } from "../src/lib/actions/generateUserConsume";
import { generateUserPairingAnswers } from "./seeds/generatePairingAnswer";
import { updateUsersCurrentType } from "./seeds/updateUsersCurrentType";

console.log("Seeding database...");

export async function main() {
  try {
    // 금융상품 더미 생성 //
    await generateFinancialProducts();
    console.log("금융상품 더미 데이터 생성 성공!");

    // 더미 유저 생성
    const userCount = 10;
    await generateUsers(userCount);
    console.log(`더미 유저 ${userCount}명 생성 성공!`);

    // 더미 유저 상품 생성
    await generateUserFinancialProductsAll();
    console.log("더미 유저 금융상품 생성 성공!");

    // 더미 대출 생성
    await generateUserLoanAll();
    console.log("더미 유저 대출 생성 성공!");

    // 더미 소비 생성
    await generateUserConsumeAll();
    console.log("더미 유저 소비 생성 성공!");

    // 더미 페어링 생성
    await generateUserPairingAnswers();
    console.log("더미 유저 페어링 답변 생성 성공!");

    // 더미 유저의 현재 타입 업데이트
    await updateUsersCurrentType();
    console.log("더미 유저의 현재 투자 성향 업데이트 성공!");

    // 주제별 퀴즈 생성
    console.log("Starting to create quiz seeds...");
    await createDepositSeed();
    console.log("예금 퀴즈 생성 성공!");

    await createSavingSeed();
    console.log("적금 퀴즈 생성 성공!");

    await createCommonSeed();
    console.log("금융상식 퀴즈 생성 성공!");

    await createLoanSeed();
    console.log("대출 퀴즈 생성 성공!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await masterPrisma.$disconnect();
  }
}

main()
  .then(() => {
    console.log("Seed 데이터 생성 성공!");
  })
  .catch((error) => {
    console.error("Seed 데이터 생성 중 에러 발생!", error);
    process.exit(1);
  });
