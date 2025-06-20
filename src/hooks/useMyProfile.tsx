import { useQuery } from "@tanstack/react-query";
import { fetchMyProfile } from "@/services/myProfile";

export const useMyProfile = () => {
  return useQuery({
    queryKey: ["myProfile"],
    queryFn: fetchMyProfile,
    staleTime: 1000 * 60, // 1분 동안은 fresh 상태
    refetchOnWindowFocus: true,
  });
};
