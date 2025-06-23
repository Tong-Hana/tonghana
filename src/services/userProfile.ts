import { UserProfile } from "@/app/types/profiles";

export interface UserProfileResponse {
  message: string;
  data: UserProfile;
}

export const fetchUserProfile = async (
  userId?: string,
): Promise<UserProfileResponse> => {
  const id = userId || "me";
  const response = await fetch(`/api/match-cards/user-summary/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch user profile");
  }

  return response.json();
};

// export const useFetchUserCard = useQuery();

// async function updateUserProfile(data: any) {
//   const response = await fetch("/api/profile", {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   });
//   if (!response.ok) {
//     throw new Error("Failed to update profile");
//   }
//   return response.json();
// }
