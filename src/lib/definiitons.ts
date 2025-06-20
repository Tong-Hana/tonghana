import { InvestmentType } from "@/lib/constants/enums";

export type ErrorResponse = {
  message: string;
  error: string;
  statusCode: number;
};
// 이런식으로 타입 정의

export interface UserProfile {
  userId: number;
  gender: "M" | "F";
  preferredGender: "M" | "F";
  currentInvestmentType: InvestmentType;
  preferredInvestmentType: InvestmentType;
}
