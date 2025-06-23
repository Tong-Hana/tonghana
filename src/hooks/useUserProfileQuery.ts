import { fetchUserProfile, UserProfileResponse } from "@/services/userProfile";
import { useQuery } from "@tanstack/react-query";

export const useUserProfileQuery = (userId?: string) => {
  return useQuery<UserProfileResponse>({
    queryKey: ["userProfile", userId ?? "me"],
    queryFn: () => fetchUserProfile(userId),
  });
};
