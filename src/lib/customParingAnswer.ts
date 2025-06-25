import { IdealIncomeRangeLabelMap, PairingAnswer } from "@/app/types/profiles";

export function customPairingAnswers(
  pairingAnswerData: PairingAnswer | undefined,
) {
  if (!pairingAnswerData) return [];
  return [
    {
      id: 1,
      answer: `${(parseInt(pairingAnswerData.carBudget) / 10000).toLocaleString()}만원, ${(pairingAnswerData.dateBudget / 10000).toLocaleString()}만원, ${(pairingAnswerData.shoesBudget / 10000).toLocaleString()}만원`,
    },
    {
      id: 2,
      answer: `${pairingAnswerData.preferredCity || ""}`,
    },
    {
      id: 3,
      answer: `${IdealIncomeRangeLabelMap[pairingAnswerData.idealIncomeRange] || ""}`,
    },
  ];
}
