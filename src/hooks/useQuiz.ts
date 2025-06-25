import { fetchQuiz, QuizResponse } from "@/services/quiz";
import { queryOptions } from "@tanstack/react-query";

export const quizQueryOptions = () => {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, "0");
  const day = String(new Date().getDate()).padStart(2, "0");
  const today = `${year}-${month}-${day}`;
  return queryOptions<QuizResponse>({
    queryKey: ["quiz", today],
    queryFn: fetchQuiz,
  });
};
