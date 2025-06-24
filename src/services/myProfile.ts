import { customFetch } from "@/lib/customFetch";
import { GoalType, GoalPeriod } from "@/lib/constants/enums";

export interface ProfilePayload {
  img?: File | null;
  description: string;
  job: string;
  goalType: GoalType;
  goalAmount: string;
  goalPeriod: GoalPeriod;
  hasCar: boolean;
  carValue?: string;
  hasHouse: boolean;
  houseValue?: string;
}

export interface ProfileRegistrationStatus {
  isRegistered: boolean;
}

export async function checkProfileRegistrationStatus(): Promise<ProfileRegistrationStatus> {
  try {
    const response = (await customFetch("/profiles/is-registered", {
      method: "GET",
    })) as unknown as ProfileRegistrationStatus;

    return response;
  } catch {
    return { isRegistered: false };
  }
}

export async function submitProfile(payload: ProfilePayload) {
  const formData = new FormData();

  if (payload.img) {
    formData.append("img", payload.img);
  }

  formData.append("description", payload.description);
  formData.append("job", payload.job);
  formData.append("goalType", payload.goalType);
  formData.append("goalAmount", payload.goalAmount);
  formData.append("goalPeriod", payload.goalPeriod);
  formData.append("hasCar", String(payload.hasCar));
  formData.append("carValue", payload.carValue || "");
  formData.append("hasHouse", String(payload.hasHouse));
  formData.append("houseValue", payload.houseValue || "");

  return await customFetch("/profiles", {
    method: "PATCH",
    body: formData,
    skipJsonParse: false,
  });
}
