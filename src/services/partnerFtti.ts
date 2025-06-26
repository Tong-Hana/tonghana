import { customFetch } from "@/lib/customFetch";

export interface PartnerFttiRequest {
  type: number;
}

export interface PartnerFttiResponse {
  message: string;
  partnerType: string;
}

export const submitPartnerFtti = async (
  data: PartnerFttiRequest,
): Promise<PartnerFttiResponse> => {
  return customFetch("/profiles/me/partner-ftti", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};
