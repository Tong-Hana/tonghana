import { AssetShareStatus } from "@/app/types/client-chat";
import {
  acceptAssetShare,
  ChatRoomInfoResponse,
  rejectAssetShare,
} from "@/services/chat";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

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

      if (data.agreeStatus === AssetShareStatus.ME_AGREED) {
        toast.success(
          "자산 공유가 요청되었습니다.\n상대방이 동의할 경우 서로의 프로필에서 자산을 확인할 수 있습니다.",
          { duration: 3000 },
        );
        return;
      }

      onSuccess?.(data);
    },
    onError: (error) => {
      toast.error(error.message ?? "자산 공유에 실패했습니다.");
      onError?.(error);
    },
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
      toast.success("자산 공유에 거절하셨습니다");
      onSuccess?.(data);
    },
    onError: (error) => {
      toast.error(error.message ?? "자산 공유 거절에 실패했습니다.");
      onError?.(error);
    },
  });
};
