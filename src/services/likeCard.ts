import { customFetch } from "@/lib/customFetch";

export interface CardLikeResponse {
  message: string;
}

export const likeCard = async (
  receiveId: number,
): Promise<CardLikeResponse> => {
  return customFetch<CardLikeResponse>("/likes/send", {
    method: "POST",
    body: JSON.stringify({ receiveId }),
  });
};
