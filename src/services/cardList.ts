import { customFetch } from "@/lib/customFetch";

export const cardList = async () => {
  return await customFetch("/match-cards");
};
