import { fetchChatPartnerInfo } from "@/services/profile";
import { useQuery } from "@tanstack/react-query";

export const useChatPartnerInfo = (partnerId?: number) => {
  return useQuery({
    queryKey: ["chatPartnerInfo", partnerId],
    queryFn: () => fetchChatPartnerInfo(partnerId!),
    staleTime: 1000 * 60, // 1분 동안은 fresh 상태
    refetchOnWindowFocus: true,
    enabled: !!partnerId,
  });
};
