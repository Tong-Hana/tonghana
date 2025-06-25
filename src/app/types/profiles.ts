import { GoalType, GoalPeriod, ProductCategory } from "@/lib/constants/enums";
export { GoalType, GoalPeriod };

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

export const PortfolioCategoryLabelMap: Record<string, string> = {
  SAVINGS: "입출금/예적금",
  DOMESTIC_STOCKS: "국내주식",
  EMERGING_STOCKS: "해외이머징주",
  DEVELOPED_STOCKS: "해외선진주식",
  DOMESTIC_BONDS: "국내채권",
  FOREIGN_BONDS: "해외채권",
  ALTERNATIVE: "대체(원자재, ELT/ELF)",
  CASH: "기타/현금성",
};

export const PortfolioCategoryColorMap: Record<string, string> = {
  SAVINGS: "#43BD9F",
  DOMESTIC_STOCKS: "#3F98FD",
  DOMESTIC_BONDS: "#3E9ECA",
  DEVELOPED_STOCKS: "#6979F1",
  EMERGING_STOCKS: "#A17EF9",
  FOREIGN_BONDS: "#E780CD",
  ALTERNATIVE: "#FF9562",
  CASH: "#F4C143",
};

export const InvestmentTypeLabelMap: Record<string, string> = {
  CONSERVATIVE: "안정형",
  MODERATE: "안정추구형",
  NEUTRAL: "위험중립형",
  AGGRESSIVE: "적극투자형",
  VERY_AGGRESSIVE: "공격투자형",
};

export const IdealIncomeRangeLabelMap: Record<string, string> = {
  NEAR_400: "400만원대",
  NEAR_600: "600만원대",
  NEAR_800: "800만원대",
  OVER_1000: "1000만원대 이상",
};

export const GOAL_TAGS = [
  "내 집 마련",
  "목돈 마련",
  "노후 자금",
  "결혼 자금",
] as const;

export const GOAL_PERIOD_OPTIONS = [
  "1년 이내",
  "3년 이내",
  "5년 이내",
  "5년 이상",
] as const;

export type GoalTag = (typeof GOAL_TAGS)[number];

export type GoalPeriodOption = (typeof GOAL_PERIOD_OPTIONS)[number];

export const goalUtils = {
  tagToEnum: (tag: GoalTag): GoalType => {
    const index = GOAL_TAGS.indexOf(tag);
    const enumValues = Object.values(GoalType);
    return enumValues[index];
  },
  enumToTag: (enumValue: GoalType): GoalTag => {
    const enumValues = Object.values(GoalType);
    const index = enumValues.indexOf(enumValue);
    return GOAL_TAGS[index];
  },
  periodOptionToValue: (option: GoalPeriodOption): GoalPeriod => {
    const index = GOAL_PERIOD_OPTIONS.indexOf(option);
    const enumValues = Object.values(GoalPeriod);
    return enumValues[index];
  },
  periodValueToOption: (value: GoalPeriod): GoalPeriodOption => {
    const enumValues = Object.values(GoalPeriod);
    const index = enumValues.indexOf(value);
    return GOAL_PERIOD_OPTIONS[index];
  },
  getEnumFromSelectedTag: (selectedTag: GoalTag | null): GoalType | null => {
    if (!selectedTag) return null;
    return goalUtils.tagToEnum(selectedTag);
  },
  getValueFromSelectedPeriod: (
    selectedPeriod: GoalPeriodOption | null,
  ): GoalPeriod | null => {
    if (!selectedPeriod) return null;
    return goalUtils.periodOptionToValue(selectedPeriod);
  },
};
