import { ProductCategory, RiskLevel } from "@/lib/constants/enums";
export type MyProfileResponse = {
  userId: number;
  nickname: string;
  consumeHistory: ConsumeHistoryResponse;
  userFinancialProduct: UserFinancialProductResponse[];
};

export type ConsumeHistoryResponse = {
  userId: number;
  savingsRate: number;
  investmentRate: number;
  leisureRate: number;
  livingExpenseRate: number;
  otherRate: number;
};

export type UserFinancialProductResponse = {
  userProductId: number;
  userId: number;
  productId: number;
  currentValue: number;
  productEndDate: Date;
  financialProduct: {
    productId: number;
    productName: string;
    institutionName: string;
    riskLevel: RiskLevel;
    category: ProductCategory;
  };
};

export const fetchMyProfile = async (): Promise<MyProfileResponse> => {
  const res = await fetch("/api/profiles/me");

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message ?? "프로필 조회에 실패했습니다.");
  }

  const parsedData = await res.json();

  return {
    ...parsedData,
    userFinancialProduct: parsedData.userFinancialProduct.map(
      (product: UserFinancialProductResponse) => ({
        ...product,
        productEndDate: new Date(product.productEndDate),
      }),
    ),
  };
};
