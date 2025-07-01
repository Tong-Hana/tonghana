import { useMutation } from "@tanstack/react-query";
import { login, LoginRequest, LoginResponse } from "@/services/login";
import * as Sentry from "@sentry/nextjs";

export const useLogin = (
  onSuccess?: (data: LoginResponse) => void,
  onError?: (error: Error) => void,
) => {
  return useMutation({
    mutationFn: (req: LoginRequest) => login(req),
    onSuccess: async (data: LoginResponse) => {
      if (data.user) {
        Sentry.setUser({
          id: data.user.userId,
        });
      }

      onSuccess?.(data);
    },
    onError,
  });
};
