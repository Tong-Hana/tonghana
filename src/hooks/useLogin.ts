import { useMutation } from "@tanstack/react-query";
import { login, LoginRequest, LoginResponse } from "@/services/login";

export const useLogin = (
  onSuccess?: (data: LoginResponse) => void,
  onError?: (error: Error) => void,
) => {
  return useMutation({
    mutationFn: (req: LoginRequest) => login(req),
    onSuccess,
    onError,
  });
};
