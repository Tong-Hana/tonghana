import { ConsumeHistory, UserProfile } from "@/app/types/profiles";

const emptyConsumeHistory = {
  savingsRate: 0,
  investmentRate: 0,
  leisureRate: 0,
  livingExpenseRate: 0,
  otherRate: 0,
};

export function customConsumeHistory(
  data: UserProfile | undefined,
): ConsumeHistory {
  return data?.consumeHistory || emptyConsumeHistory;
}
