import { useMutation } from "@tanstack/react-query";
import { signup, SignupRequest, SignupResponse } from "@/services/signup";

export const useSignup = (
  onSuccess?: (data: SignupResponse) => void,
  onError?: (error: Error) => void,
) => {
  return useMutation({
    mutationFn: (form: SignupRequest) => signup(form),
    onSuccess,
    onError,
  });
};
