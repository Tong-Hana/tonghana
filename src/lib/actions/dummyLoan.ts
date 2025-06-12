import { faker } from "@faker-js/faker/locale/ko";
import { prisma } from "@/lib/prisma";

async function dummyLoan() {
  const users = await prisma.user.findMany();
  const loanNames = [
    "하나햇살론뱅크",
    "다둥이전세론",
    "청년버팀목전세자금대출",
    "직장인스피드론",
    "사잇돌2대출",
    "청년희망적금론",
    "정부지원창업대출",
    "햇살론15",
    "청년우대형전세론",
  ];
  const loanInstitutions = [
    "하나은행",
    "국민은행",
    "신한은행",
    "우리은행",
    "농협은행",
    "카카오뱅크",
    "토스뱅크",
  ];
  for (
    let i = 0;
    i < users.length;
    i = i + faker.number.int({ min: 2, max: 3 })
  ) {
    const user = users[i];
    await prisma.loan.create({
      data: {
        userId: user.userId,
        loanName: faker.helpers.arrayElement(loanNames),
        loanInstitutionName: faker.helpers.arrayElement(loanInstitutions),
        loanBalance:
          Math.floor(
            faker.number.int({ min: 2_000_000, max: 300_000_000 }) / 1_000_000,
          ) * 1_000_000,
        loanRate: faker.number.float({ min: 3.7, max: 6.5, multipleOf: 0.1 }),
        loanEndDate: faker.date.future({ years: 5 }),
      },
    });
  }
}

async function main() {
  await dummyLoan()
    .then(() => {
      console.log("Dummy pairing data created successfully.");
    })
    .catch((error) => {
      console.error("Error creating dummy pairing data:", error);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
main();
