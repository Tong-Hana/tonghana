import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import { logout } from "@/services/logout";

export const useLogout = (
  options?: UseMutationOptions<string, Error, void>,
) => {
  return useMutation<string, Error, void>({
    mutationFn: logout,
    ...options,
  });
};
