import { useMutation } from "@tanstack/react-query";
import {
  postFttiAnswers,
  FttiAnswersPayload,
  FttiResult,
} from "@/services/ftti";

export function useFttiMutation(options?: {
  onSuccess?: (data: FttiResult) => void;
  onError?: (error: unknown) => void;
}) {
  return useMutation<FttiResult, unknown, FttiAnswersPayload>({
    mutationFn: postFttiAnswers,
    ...options,
  });
}
