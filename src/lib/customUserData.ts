import { CardUser } from "@/app/types/cardList";
import {
  CategoryRatios,
  GoalPeriod,
  GoalType,
  goalUtils,
  UserBadge,
  UserProfile,
} from "@/app/types/profiles";

const emptyCategoryRatios = {
  SAVINGS: 0,
  DOMESTIC_STOCKS: 0,
  DEVELOPED_STOCKS: 0,
  EMERGING_STOCKS: 0,
  DOMESTIC_BONDS: 0,
  FOREIGN_BONDS: 0,
  ALTERNATIVE: 0,
  CASH: 0,
};

const emptyUserBadges = {
  diligent: 0,
  planner: 0,
  saver: 0,
  investor: 0,
};

export function customUser(data: UserProfile | CardUser | undefined) {
  if (!data) {
    return {
      id: 0,
      name: "이름 없음",
      age: 0,
      job: "직업 정보 없음",
      location: "지역 정보 없음",
      description: "소개 정보 없음",
      imageUrl: "/jennie.jpg",
      target: "목표 없음",
      totalAsset: undefined,
      hasCar: false,
      hasHouse: false,
      carCost: undefined,
      houseCost: undefined,
      portfolioRatios: emptyCategoryRatios as CategoryRatios,
      badges: emptyUserBadges as UserBadge,
      debtPercent: "0%",
      investorType: "정보 없음",
      portfolioType: "정보 없음",
    };
  }
  return {
    id: data.userId,
    name: data.nickname || "이름 없음",
    age: new Date().getFullYear() - (data.birthYear || 2000),
    job: data.job || "직업 정보 없음",
    location: data.city || "지역 정보 없음",
    description: data.description || "소개 정보 없음",
    imageUrl: data.profileImage || "/jennie.jpg",
    target:
      (goalUtils.periodValueToOption(data.goalPeriod as GoalPeriod) || "") +
      " " +
      (goalUtils.enumToTag(data.goalType as GoalType) || "") +
      "!",
    totalAsset:
      "totalAsset" in data && data.totalAsset
        ? `${(data.totalAsset / 10000).toLocaleString()}만원`
        : undefined,
    hasCar: data.hasCar,
    hasHouse: data.hasHouse,
    carCost:
      "carValue" in data && data.carValue
        ? `${(data.carValue / 10000).toLocaleString()}만원`
        : undefined,
    houseCost:
      "houseValue" in data && data.houseValue
        ? `${(data.houseValue / 10000).toLocaleString()}만원`
        : undefined,
    portfolioRatios: (data.categoryRatios ||
      emptyCategoryRatios) as CategoryRatios,
    badges: (data.badges || emptyUserBadges) as UserBadge,
    debtPercent: `${data.financialProductRatio?.loanRatio || 0}%`,
    investorType: data.preferredType || "정보 없음",
    portfolioType: data.currentType || "정보 없음",
  };
}
