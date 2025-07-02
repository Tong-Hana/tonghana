import { customFetch } from "@/lib/customFetch";

export interface ProfileEditRequest {
  nickname?: string;
  job?: string;
  goalAmount?: number;
  goalPeriod?: string;
  goalType?: string;
  description?: string;
  profileImage?: string;
  hasCar?: boolean;
  carValue?: number;
  hasHouse?: boolean;
  houseValue?: number;
  city?: string;
  pairingAnswer?: string;
}

export interface ProfileEditResponse {
  message: string;
}

export const updateProfile = async (
  data: ProfileEditRequest,
): Promise<ProfileEditResponse> => {
  return customFetch("/profiles/me", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};
