import { useQuery } from "@tanstack/react-query";
import { fetchChatRooms } from "@/services/chat";

export const useChatRooms = () => {
  return useQuery({
    queryKey: ["chatRooms"],
    queryFn: fetchChatRooms,
    staleTime: 1000 * 60, // 1분 동안은 fresh 상태
    refetchOnWindowFocus: true,
  });
};
