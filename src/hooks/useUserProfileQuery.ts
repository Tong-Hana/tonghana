import { UserProfileResponse } from "@/services/userProfile";
import { queryOptions } from "@tanstack/react-query";
import { fetchUserProfile } from "@/services/userProfile";

export const userProfileOptions = (userId: string) =>
  queryOptions<UserProfileResponse>({
    queryKey: ["userProfile", userId],
    queryFn: () => fetchUserProfile(userId),
  });
