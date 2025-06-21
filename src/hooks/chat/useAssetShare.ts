import {
  acceptAssetShare,
  ChatRoomInfoResponse,
  rejectAssetShare,
} from "@/services/chat";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAgreeToShareAsset = (
  onSuccess?: (data: ChatRoomInfoResponse) => void,
  onError?: (error: Error) => void,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ myId, roomId }: { myId: number; roomId: number }) =>
      acceptAssetShare(myId, roomId),
    onSuccess: (data) => {
      queryClient.setQueryData(["chatRoom", data.myId, data.roomId], data);
      onSuccess?.(data);
    },

    onError,
  });
};

export const useRejectToShareAsset = (
  onSuccess?: (data: ChatRoomInfoResponse) => void,
  onError?: (error: Error) => void,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ myId, roomId }: { myId: number; roomId: number }) =>
      rejectAssetShare(myId, roomId),
    onSuccess: (data) => {
      queryClient.setQueryData(["chatRoom", data.myId, data.roomId], data);
      onSuccess?.(data);
    },
    onError,
  });
};
