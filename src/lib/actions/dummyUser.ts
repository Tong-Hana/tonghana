import { Faker, ko, en } from "@faker-js/faker";
import { prisma } from "@/lib/prisma";

const faker = new Faker({ locale: [ko] });
const fakerEn = new Faker({ locale: [en] });

type Gender = "M" | "F";
type GoalPeriod =
  | "WITHIN_1_YEAR"
  | "WITHIN_3_YEARS"
  | "WITHIN_5_YEARS"
  | "MORE_THAN_5_YEARS";
type GoalType = "HOUSE" | "LUMPSUM" | "RETIREMENT" | "MARRIAGE";
type InvestmentType =
  | "CONSERVATIVE"
  | "MODERATE"
  | "NEUTRAL"
  | "AGGRESSIVE"
  | "VERY_AGGRESSIVE";
const cities = ["서울시 성동구", "서울시 강남구", "서울시 종로구"];
function generateUser() {
  const hasCar = faker.datatype.boolean();
  const hasHouse = faker.datatype.boolean();
  const g = faker.helpers.arrayElement<Gender>(["M", "F"]);
  const sexType = g === "M" ? "male" : "female";
  const name = faker.person.firstName(sexType);

  return {
    email: fakerEn.internet.email({ firstName: fakerEn.person.firstName() }),
    birthYear: faker.number.int({ min: 1980, max: 2005 }),
    carValue: hasCar
      ? Math.floor(
          faker.number.int({ min: 5_000_000, max: 100_000_000 }) / 10_000,
        ) * 10_000
      : null,
    city: faker.helpers.arrayElement(cities),
    createdAt: new Date().toISOString(),
    currentType: null,
    description: `안녕하세요. ${name}입니다.`,
    gender: g,
    goalAmount:
      Math.floor(
        faker.number.int({ min: 5_000_000, max: 1_000_000_000 }) / 1_000_000,
      ) * 1_000_000,
    goalPeriod: faker.helpers.arrayElement<GoalPeriod>([
      "WITHIN_1_YEAR",
      "WITHIN_3_YEARS",
      "WITHIN_5_YEARS",
      "MORE_THAN_5_YEARS",
    ]),
    goalType: faker.helpers.arrayElement<GoalType>([
      "HOUSE",
      "LUMPSUM",
      "RETIREMENT",
      "MARRIAGE",
    ]),
    hasCar,
    hasHouse,
    houseValue: hasHouse
      ? Math.floor(
          faker.number.int({ min: 100_000_000, max: 1_000_000_000 }) / 10_000,
        ) * 10_000
      : null,
    job: faker.helpers.arrayElement([
      "학생",
      "인플루언서",
      "직장인",
      "프리랜서",
      "자영업자",
      "기타",
    ]),
    nickname: name,
    password: faker.internet.password({ length: 10 }),
    preferredType: faker.helpers.arrayElement<InvestmentType>([
      "CONSERVATIVE",
      "MODERATE",
      "NEUTRAL",
      "AGGRESSIVE",
      "VERY_AGGRESSIVE",
    ]),
    profileImage: faker.image.avatar(),
  };
}

async function pushUser() {
  const user = generateUser();
  await prisma.user.create({
    data: {
      email: user.email,
      birthYear: user.birthYear,
      carValue: user.carValue,
      city: user.city,
      createdAt: user.createdAt,
      currentType: user.currentType,
      description: user.description,
      gender: user.gender,
      goalAmount: user.goalAmount,
      goalPeriod: user.goalPeriod,
      goalType: user.goalType,
      hasCar: user.hasCar,
      hasHouse: user.hasHouse,
      houseValue: user.houseValue,
      job: user.job,
      nickname: user.nickname,
      password: user.password,
      preferredType: user.preferredType,
      profileImage: user.profileImage,
    },
  });
}
async function main() {
  try {
    await pushUser();
  } catch (error) {
    console.error("Error creating user:", error);
  } finally {
    await prisma.$disconnect();
  }
}
for (let i = 0; i < 100; i++) {
  main();
}
