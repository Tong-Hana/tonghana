import { faker } from "@faker-js/faker/locale/ko";
import { User } from "@prisma/client";
import { masterPrisma } from "../prisma/masterClient";
import { replicaPrisma } from "../prisma/replicaClient";

const loanNames = [
  "주택담보대출",
  "전월세대출",
  "청년버팀목전세자금대출",
  "직장인스피드론",
  "오토론",
  "신용대출",
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

// 유저의 대출 더미데이터 생성
export async function generateUserLoan(user: User) {
  const bool = Math.random() < 0.5;
  if (!bool) return;

  await masterPrisma.loan.create({
    data: {
      userId: user.userId,
      loanName: faker.helpers.arrayElement(loanNames),
      loanInstitutionName: faker.helpers.arrayElement(loanInstitutions),
      loanBalance: faker.number.int({ min: 200, max: 50000 }) * 10_000,
      loanRate: faker.number.float({ min: 3.7, max: 6.5, multipleOf: 0.1 }),
      loanEndDate: faker.date.future({ years: 5 }),
    },
  });
}

// 모든 더미 유저의 대출 더미데이터 생성
export async function generateUserLoanAll() {
  const users = await replicaPrisma.user.findMany();
  for (const user of users) {
    await generateUserLoan(user);
  }
}
