import { leaveChatRoom } from "@/services/chat";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useLeaveChatRoom = (
  onSuccess?: () => void,
  onError?: (error: Error) => void,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roomId: number) => leaveChatRoom(roomId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["chatRooms"],
      });
      onSuccess?.();
    },
    onError,
  });
};
