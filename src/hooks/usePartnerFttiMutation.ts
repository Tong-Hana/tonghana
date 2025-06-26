import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import {
  submitPartnerFtti,
  PartnerFttiRequest,
  PartnerFttiResponse,
} from "@/services/partnerFtti";

export const usePartnerFttiMutation = (
  options?: UseMutationOptions<
    PartnerFttiResponse,
    Error,
    PartnerFttiRequest,
    unknown
  >,
) => {
  return useMutation({
    mutationFn: submitPartnerFtti,
    ...options,
  });
};
