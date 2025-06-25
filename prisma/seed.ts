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

if (process.env.NODE_ENV === "production") {
  throw new Error("운영 환경에서 seed 스크립트를 실행할 수 없습니다!");
}

export async function main() {
  try {
    // 금융상품 더미 생성 //
    const exsistingCount = await masterPrisma.financialProduct.count();
    if (exsistingCount === 0) {
      await generateFinancialProducts();
      console.log("금융상품 더미 데이터 생성 성공!");
    } else {
      console.log("금융상품 더미 데이터 존재. 생성 생략!");
    }

    // 더미 유저 생성
    const userCount = 10;
    const createdUsers = await generateUsers(userCount);
    console.log(`더미 유저 ${userCount}명 생성 성공!`);

    // 더미 유저 상품 생성
    await generateUserFinancialProductsAll(createdUsers);
    console.log("더미 유저 금융상품 생성 성공!");
    // 더미 대출 생성
    await generateUserLoanAll(createdUsers);
    console.log("더미 유저 대출 생성 성공!");
    // 더미 소비 생성
    await generateUserConsumeAll(createdUsers);
    console.log("더미 유저 소비 생성 성공!");
    // 더미 페어링 생성
    await generateUserPairingAnswers(createdUsers);
    console.log("더미 유저 페어링 답변 생성 성공!");
    // 더미 유저의 현재 타입 업데이트
    await updateUsersCurrentType(createdUsers);
    console.log("더미 유저의 현재 투자 성향 업데이트 성공!");

    // 주제별 퀴즈 생성
    const depositCount = await masterPrisma.subject.count({
      where: { subjectType: "정기예금" },
    });
    if (depositCount === 0) {
      await createDepositSeed();
      console.log("예금 퀴즈 생성 성공!");
    } else {
      console.log("예금 퀴즈 데이터 존재. 생성 생략!");
    }

    const savingCount = await masterPrisma.subject.count({
      where: { subjectType: "적금" },
    });
    if (savingCount === 0) {
      await createSavingSeed();
      console.log("적금 퀴즈 생성 성공!");
    } else {
      console.log("적금 퀴즈 데이터 존재. 생성 생략!");
    }

    const commonCount = await masterPrisma.subject.count({
      where: { subjectType: "금융상식" },
    });
    if (commonCount === 0) {
      await createCommonSeed();
      console.log("금융상식 퀴즈 생성 성공!");
    } else {
      console.log("금융상식 퀴즈 데이터 존재. 생성 생략!");
    }

    const loanCount = await masterPrisma.subject.count({
      where: { subjectType: "대출" },
    });
    if (loanCount === 0) {
      await createLoanSeed();
      console.log("대출 퀴즈 생성 성공!");
    } else {
      console.log("대출 퀴즈 데이터 존재. 생성 생략!");
    }
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
