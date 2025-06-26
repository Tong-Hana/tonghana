import { ProductCategory } from "@/lib/constants/enums";

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
export type CategoryKey = `${ProductCategory}`;

export const categoryKeys: CategoryKey[] = Object.values(ProductCategory);

export type CategoryRatios = Record<CategoryKey, number>;

// 라벨 매핑
export const PortfolioCategoryLabelMap: Record<CategoryKey, string> = {
  SAVINGS: "입출금/예적금",
  DOMESTIC_STOCKS: "국내주식",
  EMERGING_STOCKS: "해외이머징주",
  DEVELOPED_STOCKS: "해외선진주식",
  DOMESTIC_BONDS: "국내채권",
  FOREIGN_BONDS: "해외채권",
  ALTERNATIVE: "대체(원자재, ELT/ELF)",
  CASH: "기타/현금성",
};

export const PortfolioCategoryColorMap: Record<CategoryKey, string> = {
  SAVINGS: "#43bd9f",
  DOMESTIC_STOCKS: "#3f98fd",
  DOMESTIC_BONDS: "#3e9eca",
  DEVELOPED_STOCKS: "#6979f1",
  EMERGING_STOCKS: "#a17ef9",
  FOREIGN_BONDS: "#e780cd",
  ALTERNATIVE: "#ff9562",
  CASH: "#f4c143",
};
