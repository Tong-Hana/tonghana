import { customFetch } from "@/lib/customFetch";

export interface CardLikeResponse {
  message: string;
}

export const deleteCard = async (
  receiveId: number,
): Promise<CardLikeResponse> => {
  return customFetch<CardLikeResponse>("/match-cards/pass", {
    method: "PATCH",
    body: JSON.stringify({ receiveId }),
  });
};
