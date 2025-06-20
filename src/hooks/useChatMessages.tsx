import { useQuery } from "@tanstack/react-query";
import { fetchChatMessages } from "@/services/chat";

export const useChatMessages = (roomId: number) => {
  return useQuery({
    queryKey: ["chatMessages"],
    queryFn: () => fetchChatMessages(roomId),
    staleTime: 1000 * 60, // 1분 동안은 fresh 상태
    refetchOnWindowFocus: true,
  });
};
