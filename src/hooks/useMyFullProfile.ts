import { useQuery } from "@tanstack/react-query";
import { fetchUserProfile, UserProfileResponse } from "@/services/userProfile";

export const useMyFullProfile = () => {
  return useQuery<UserProfileResponse>({
    queryKey: ["userProfile", "me"],
    queryFn: () => fetchUserProfile("me"),
  });
};
