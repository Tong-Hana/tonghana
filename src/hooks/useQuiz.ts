import {
  fetchQuiz,
  fetchQuizDetail,
  fetchQuizLog,
  patchQuizLog,
  QuizDetailResponse,
  QuizResponse,
  submitQuizLog,
} from "@/services/quiz";
import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { UserQuizLog } from "@/app/types/quiz";
import { useUserStore } from "@/lib/store/userStore";

function getTodayDate() {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, "0");
  const day = String(new Date().getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export const quizQueryOptions = () => {
  return queryOptions<QuizResponse>({
    queryKey: ["quiz", getTodayDate()],
    queryFn: fetchQuiz,
  });
};

export const quizLogQueryOptions = () => {
  return queryOptions({
    queryKey: ["quiz-log"],
    queryFn: fetchQuizLog,
  });
};

export const quizDetailQueryOptions = () => {
  return queryOptions<QuizDetailResponse>({
    queryKey: ["quiz-detail"],
    queryFn: fetchQuizDetail,
  });
};

export const useQuizLog = (
  onSuccess?: (data: UserQuizLog) => void,
  onError?: (error: Error) => void,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: boolean) => submitQuizLog(data),
    onSuccess: (data: UserQuizLog) => {
      queryClient.setQueryData(["quiz-log"], data);
      if (onSuccess) {
        onSuccess(data);
      }
    },
    onError,
  });
};

export const usePatchQuizLog = (
  onSuccess?: (data: UserQuizLog) => void,
  onError?: (error: Error) => void,
) => {
  const { setIsQuizResolved } = useUserStore();

  return useMutation({
    mutationFn: (isPassed: boolean) => patchQuizLog(isPassed),
    onSuccess: (data: UserQuizLog) => {
      if (data.isPassed) {
        setIsQuizResolved(data.isPassed);
      }
      if (onSuccess) {
        onSuccess(data);
      }
    },
    onError,
  });
};
