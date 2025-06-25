// 유저 더미데이터 생성

import { en, Faker, ko } from "@faker-js/faker";
import bcrypt from "bcryptjs";
import {
  Gender,
  GoalPeriod,
  GoalType,
  InvestmentType,
} from "../../src/lib/constants/enums";
import { REGIONS } from "../../src/constants/regions";
import { masterPrisma } from "../../src/lib/prisma/masterClient";
import { User } from "@prisma/client";

const faker = new Faker({ locale: [ko] });
const fakerEn = new Faker({ locale: [en] });

export function getRandomCity(): string {
  const states = Object.keys(REGIONS); // 서울시, 경기도 ...
  const randomState = faker.helpers.arrayElement(states);
  const cities = REGIONS[randomState]; // 해당 시/도의 군/구 목록
  const randomCity = faker.helpers.arrayElement(cities); // 군/구 랜덤 선택

  return `${randomState} ${randomCity}`; // "서울시 성동구" 형태로 반환
}

// const cities = ["서울시 성동구", "서울시 강남구", "서울시 종로구"];
async function createUser() {
  const nickname = faker.person.firstName();
  const email = fakerEn.internet.email({
    firstName: fakerEn.person.firstName(),
  });
  const hashedPassword = await bcrypt.hash("1234", 10);
  const birthYear = faker.number.int({ min: 1980, max: 2005 });
  const city = getRandomCity();
  const description = `안녕하세요. ${nickname} 입니다.`;
  const gender = faker.helpers.arrayElement<Gender>([Gender.F, Gender.M]);
  const job = faker.helpers.arrayElement([
    "학생",
    "개발자",
    "은행원",
    "디자이너",
    "직장인",
    "프리랜서",
    "자영업자",
    "인플루언서",
    "기타",
  ]);

  const goalAmount = faker.number.int({ min: 5, max: 1000 }) * 1_000_000;
  const goalPeriod = faker.helpers.arrayElement<GoalPeriod>([
    GoalPeriod.WITHIN_1_YEAR,
    GoalPeriod.WITHIN_3_YEARS,
    GoalPeriod.WITHIN_5_YEARS,
    GoalPeriod.MORE_THAN_5_YEARS,
  ]);
  const goalType = faker.helpers.arrayElement<GoalType>([
    GoalType.HOUSE,
    GoalType.LUMPSUM,
    GoalType.RETIREMENT,
    GoalType.MARRIAGE,
  ]);

  const hasCar = faker.datatype.boolean();
  const hasHouse = faker.datatype.boolean();
  const carValue = hasCar
    ? faker.number.int({ min: 5, max: 300 }) * 1_000_000
    : null;
  const houseValue = hasHouse
    ? faker.number.int({ min: 10, max: 100 }) * 10_000_000
    : null;

  const preferredType = faker.helpers.arrayElement<InvestmentType>([
    InvestmentType.CONSERVATIVE,
    InvestmentType.MODERATE,
    InvestmentType.NEUTRAL,
    InvestmentType.AGGRESSIVE,
    InvestmentType.VERY_AGGRESSIVE,
  ]);

  const profileImage = faker.image.avatar();

  const user = await masterPrisma.user.create({
    data: {
      nickname,
      email,
      password: hashedPassword,
      birthYear,
      city,
      description,
      gender,
      job,
      goalAmount,
      goalPeriod,
      goalType,
      hasCar,
      hasHouse,
      carValue,
      houseValue,
      preferredType,
      profileImage,
    },
  });

  return user;
}

// 더미유저 생성, 생성갯수 입력
export async function generateUsers(count: number) {
  const createdUsers: User[] = [];
  for (let i = 0; i < count; i++) {
    const user = await createUser();
    createdUsers.push(user);
  }
  return createdUsers;
}
