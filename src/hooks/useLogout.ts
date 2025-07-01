import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import { logout } from "@/services/logout";
import * as Sentry from "@sentry/nextjs";

export const useLogout = (
  options?: UseMutationOptions<string, Error, void>,
) => {
  return useMutation<string, Error, void>({
    mutationFn: logout,
    onSuccess: (data, variables, context) => {
      Sentry.setUser(null);
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};
