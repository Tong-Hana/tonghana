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
  console.log("🚀 FTTI 요청 전송:", payload);

  const response = await customFetch<FttiResult>("/profiles/me/ftti", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  console.log("✅ FTTI 응답 받음:", response);

  return response;
};
