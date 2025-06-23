import {
  CategoryRatios,
  ConsumeHistory,
  FinancialProductRatio,
  PairingAnswer,
} from "@/app/types/profile";
import {
  Gender,
  GoalPeriod,
  GoalType,
  InvestmentType,
} from "@/lib/constants/enums";

export interface UserProfileResponse {
  userId: number;
  nickname: string;
  gender: Gender;
  birthYear: number;
  city: string;
  job: string;
  description: string;
  profileImage: string;
  hasCar: boolean;
  hasHouse: boolean;
  carValue: number;
  houseValue: number;
  goalAmount: number;
  totalAsset: number;
  goalPeriod: GoalPeriod;
  goalType: GoalType;
  currentType: InvestmentType;
  preferredType?: InvestmentType;
  pairingAnswer?: PairingAnswer;
  consumeHistory: ConsumeHistory;
  financialProductRatio: FinancialProductRatio;
  categoryRatios: CategoryRatios;
}

export const fetchMyProfile = async (): Promise<UserProfileResponse> => {
  const res = await fetch("/api/match-cards/user-summary/me");

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message ?? "프로필 조회에 실패했습니다.");
  }

  const parsedData = (await res.json()).data as UserProfileResponse;

  const percentRatios: CategoryRatios = Object.fromEntries(
    Object.entries(parsedData.categoryRatios).map(([key, value]) => [
      key,
      parseFloat((value * 100).toFixed(1)),
    ]),
  ) as CategoryRatios;

  return {
    ...parsedData,
    categoryRatios: percentRatios,
  };
};

export const fetchChatPartnerInfo = async (
  userId: number,
): Promise<UserProfileResponse> => {
  const res = await fetch(`/api/match-cards/user-summary/${userId}`);

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message ?? "채팅 상대 정보 조회에 실패했습니다.");
  }

  const parsedData = (await res.json()).data as UserProfileResponse;

  const percentRatios: CategoryRatios = Object.fromEntries(
    Object.entries(parsedData.categoryRatios).map(([key, value]) => [
      key,
      parseFloat((value * 100).toFixed(1)),
    ]),
  ) as CategoryRatios;

  return {
    ...parsedData,
    categoryRatios: percentRatios,
  };
};
