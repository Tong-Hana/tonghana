import { Subject, UserQuizLog } from "@/app/types/quiz";
import { customFetch } from "@/lib/customFetch";

export type QuizResponse = {
  subject: Subject;
};

export const fetchQuiz = async (): Promise<QuizResponse> => {
  const res = await fetch(`/api/subject`, {
    method: "GET",
    cache: "force-cache",
  });
  return res.json();
};

export const fetchQuizLog = async (): Promise<UserQuizLog> => {
  return await customFetch<UserQuizLog>("/quiz-log", {
    method: "GET",
    cache: "force-cache",
  });
};
