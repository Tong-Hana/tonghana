import { useQuery } from "@tanstack/react-query";
import { fetchChatRoomInfo } from "@/services/chat";

export const useChatRoomInfo = (myId?: number, roomId?: number) => {
  return useQuery({
    queryKey: ["chatRoom", myId, roomId],
    queryFn: () => fetchChatRoomInfo(myId!, roomId!),
    staleTime: 1000 * 60, // 1분 동안은 fresh 상태
    refetchOnWindowFocus: true,
    enabled: !!myId && !!roomId,
  });
};
