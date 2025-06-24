import { withdraw } from "@/services/withdraw";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

export const useWithdraw = (
  options?: UseMutationOptions<string, Error, void>,
) => {
  return useMutation<string, Error, void>({
    mutationFn: withdraw,
    ...options,
  });
};
