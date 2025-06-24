import { UserProfileResponse } from "@/services/userProfile";
import { queryOptions } from "@tanstack/react-query";
import { customFetch } from "@/lib/customFetch";

export const userProfileOptions = (userId: string) =>
  queryOptions<UserProfileResponse>({
    queryKey: ["userProfile", userId],
    queryFn: () => fetchUserProfile(userId),
  });

export const fetchUserProfile = async (
  userId?: string,
): Promise<UserProfileResponse> => {
  const id = userId || "me";
  return customFetch(`/match-cards/user-summary/${id}`);
};

// export const useUserProfileQuery = (userId?: string) => {
//   return useSuspenseQuery(userProfileOptions(userId));
// };
