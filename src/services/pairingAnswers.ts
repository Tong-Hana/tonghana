import { customFetch } from "@/lib/customFetch";

export interface PairingAnswersData {
  car_budget: string;
  dateBudget: number;
  shoesBudget: number;
  preferredCity: string;
  idealIncomeRange: string;
}

export const savePairingAnswers = async (data: PairingAnswersData) => {
  return customFetch("/profiles/me/pairing-answers", {
    method: "POST",
    body: JSON.stringify(data),
  });
};
