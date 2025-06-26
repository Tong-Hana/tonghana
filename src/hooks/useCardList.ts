import { queryOptions } from "@tanstack/react-query";
import { cardList } from "@/services/cardList";

export const cardListOptions = () =>
  queryOptions({
    queryKey: ["cardList"],
    queryFn: cardList,
  });
