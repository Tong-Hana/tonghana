import {
  fetchQuiz,
  fetchQuizDetail,
  fetchQuizLog,
  QuizDetailResponse,
  QuizResponse,
  submitQuizLog,
} from "@/services/quiz";
import { queryOptions, useMutation } from "@tanstack/react-query";
import { UserQuizLog } from "@/app/types/quiz";

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
  return useMutation({
    mutationFn: (data: boolean) => submitQuizLog(data),
    onSuccess,
    onError,
  });
};
