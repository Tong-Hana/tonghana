import { masterPrisma } from "../src/lib/prisma/masterClient";
import {
  createDepositSeed,
  createSavingSeed,
  createCommonSeed,
  createLoanSeed,
} from "./seeds/subjectQuiz";

console.log("Seeding database...");

export async function main() {
  try {
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
    console.log("Seeding completed successfully.");
  })
  .catch((error) => {
    console.error("Error during seeding:", error);
    process.exit(1);
  });
