import { customFetch } from "@/lib/customFetch";

export interface MyProfileDetailResponse {
  userId: number;
  nickname: string;
  consumeHistory: {
    userId: number;
    savingsRate: string;
    investmentRate: string;
    leisureRate: string;
    livingExpenseRate: string;
    otherRate: string;
  };
  userFinancialProduct: Array<{
    userProductId: number;
    userId: number;
    productId: number;
    currentValue: string;
    productEndDate: string | null;
    financialProduct: {
      productId: number;
      productName: string;
      institutionName: string;
      riskLevel: string;
      category: string;
    };
  }>;
}

export const fetchMyProfileDetail =
  async (): Promise<MyProfileDetailResponse> => {
    return customFetch("/profiles/me");
  };
