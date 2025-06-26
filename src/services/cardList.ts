import { CardListResponse } from "@/app/types/cardList";
import { customFetch } from "@/lib/customFetch";

export const cardList = async (): Promise<CardListResponse> => {
  return await customFetch<CardListResponse>("/match-cards");
};
