import {
  acceptLike,
  LikeResponse,
  MatchLikeResponse,
  rejectLike,
} from "@/services/like";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useLikeAccept = (
  matchId: number,
  onSuccess?: (reposnse: LikeResponse) => void,
  onError?: (error: Error) => void,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (matchId: number) => acceptLike(matchId),
    onSuccess: (data) => {
      const filteredReceivedLikes = queryClient
        .getQueryData<MatchLikeResponse[]>(["receivedLikes"])
        ?.filter((match) => match.matchId !== matchId);

      queryClient.setQueryData(["receivedLikes"], filteredReceivedLikes);
      queryClient.invalidateQueries({ queryKey: ["chatRooms"] });
      onSuccess?.(data);
    },
    onError,
  });
};

export const useLikeReject = (
  matchId: number,
  onSuccess?: (reposnse: LikeResponse) => void,
  onError?: (error: Error) => void,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (matchId: number) => rejectLike(matchId),
    onSuccess: (data) => {
      const filteredReceivedLikes = queryClient
        .getQueryData<MatchLikeResponse[]>(["receivedLikes"])
        ?.filter((match) => match.matchId !== matchId);

      queryClient.setQueryData(["receivedLikes"], filteredReceivedLikes);
      onSuccess?.(data);
    },
    onError,
  });
};
