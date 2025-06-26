import { fetchReceivedLikes } from "@/services/like";
import { useQuery } from "@tanstack/react-query";

export const useReceivedLikes = () => {
  return useQuery({
    queryKey: ["receivedLikes"],
    queryFn: fetchReceivedLikes,
    staleTime: 1000 * 60, // 1분 동안은 fresh 상태
    refetchOnWindowFocus: true,
  });
};
