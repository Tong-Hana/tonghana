import { likeCard } from "@/services/likeCard";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CardListResponse } from "@/app/types/cardList";

export interface CardLikeResponse {
  message: string;
}

export const useCardLike = (
  targetUserId: number,
  onSuccess?: (response: CardLikeResponse) => void,
  onError?: (error: Error) => void,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (receiveId: number) => likeCard(receiveId),
    onMutate: async (receiveId: number) => {
      await queryClient.cancelQueries({ queryKey: ["cardList"] });

      const previousCardList = queryClient.getQueryData<CardListResponse>([
        "cardList",
      ]);

      queryClient.setQueryData<CardListResponse>(["cardList"], (old) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.filter((card) => card.userId !== receiveId),
        };
      });

      return { previousCardList };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cardList"] });
      onSuccess?.(data);
    },
    onError: (error, receiveId, context) => {
      if (context?.previousCardList) {
        queryClient.setQueryData(["cardList"], context.previousCardList);
      }
      onError?.(error);
    },
  });
};
