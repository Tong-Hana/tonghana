import { UserProfile } from "@/app/types/profiles";
import { customFetch } from "@/lib/customFetch";

export interface UserProfileResponse {
  message: string;
  data: UserProfile;
}

export const fetchUserProfile = async (
  userId?: string,
): Promise<UserProfileResponse> => {
  const id = userId || "me";

  return customFetch(`/match-cards/user-summary/${id}`, {
    cache: "no-cache",
  });
};
