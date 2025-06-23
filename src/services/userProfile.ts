export interface PairingAnswer {
  carBudget: number;
  dateBudget: number;
  shoesBudget: number;
  preferredCity: string;
  idealIncomeRange: string;
}

export interface ConsumeHistory {
  savingsRate: number;
  investmentRate: number;
  leisureRate: number;
  livingExpenseRate: number;
  otherRate: number;
}

export interface FinancialProductRatio {
  financeRatio: number;
  loanRatio: number;
}

export interface CategoryRatios {
  DOMESTIC_STOCKS: number;
  DEVELOPED_STOCKS: number;
  CASH: number;
}

export interface UserProfile {
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
  carValue: number;
  houseValue: number;
  goalAmount: number;
  totalAsset: number;
  goalPeriod: string;
  goalType: string;
  currentType: string;
  preferredType: string;
  pairingAnswer: PairingAnswer;
  consumeHistory: ConsumeHistory;
  financialProductRatio: FinancialProductRatio;
  categoryRatios: CategoryRatios;
}

export interface UserProfileResponse {
  message: string;
  data: UserProfile;
}

export const fetchUserProfile = async (
  userId?: string,
): Promise<UserProfileResponse> => {
  const id = userId || "me";
  const response = await fetch(`/api/match-cards/user-summary/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch user profile");
  }

  return response.json();
};

// export const useFetchUserCard = useQuery();

// async function updateUserProfile(data: any) {
//   const response = await fetch("/api/profile", {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   });
//   if (!response.ok) {
//     throw new Error("Failed to update profile");
//   }
//   return response.json();
// }
