import { deleteCard } from "@/services/deleteCard";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CardListResponse } from "@/app/types/cardList";

export interface CardRemoveResponse {
  message: string;
}

export const useCardRemove = (
  targetUserId: number,
  onError?: (error: Error) => void,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (receiveId: number) => deleteCard(receiveId),
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cardList"] });
    },
    onError: (error, receiveId, context) => {
      if (context?.previousCardList) {
        queryClient.setQueryData(["cardList"], context.previousCardList);
      }
      onError?.(error);
    },
  });
};
