import { useQuery } from "@tanstack/react-query";
import { fetchChatPartnerInfo } from "@/services/chat";

export const useChatPartnerInfo = (partnerId?: number) => {
  return useQuery({
    queryKey: ["chatPartnerInfo", partnerId],
    queryFn: () => fetchChatPartnerInfo(partnerId!),
    staleTime: 1000 * 60, // 1분 동안은 fresh 상태
    refetchOnWindowFocus: true,
    enabled: !!partnerId,
  });
};
