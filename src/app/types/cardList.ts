import {
  CategoryRatios,
  FinancialProductRatio,
  GoalPeriod,
  GoalType,
} from "./profiles";

export interface RandomSubject {
  subjectId: number;
  subjectType: string;
  title: string;
  description: string;
  features: string;
  period: string;
  amount: string;
  interestRate: string;
  subjectUrl: string;
}

export interface CardUser {
  userId: number;
  nickname: string;
  gender: string;
  birthYear: number;
  city: string;
  job: string;
  description: string;
  profileImage: string;
  hasCar: boolean;
  hasHouse: boolean;
  goalAmount: number;
  goalPeriod: GoalPeriod;
  goalType: GoalType;
  currentType: string;
  preferredType: string;
  financialProductRatio: FinancialProductRatio;
  categoryRatios: CategoryRatios;
}

export interface CardListResponse {
  message: string;
  data: CardUser[];
  randomSubject: RandomSubject;
}
