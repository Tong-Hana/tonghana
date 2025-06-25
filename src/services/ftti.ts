import { customFetch } from "@/lib/customFetch";

export interface FttiAnswersPayload {
  answers: (number | number[])[];
}

export interface FttiResult {
  message: string;
  resultType: string;
  totalScore: number;
}

export const postFttiAnswers = async (
  payload: FttiAnswersPayload,
): Promise<FttiResult> => {
  return customFetch("/profiles/me/ftti", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};
