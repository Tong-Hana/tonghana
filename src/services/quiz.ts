import { Quiz } from "@/app/types/quiz";

export type QuizResponse = {
  subject: Quiz;
};

export const fetchQuiz = async (): Promise<QuizResponse> => {
  const res = await fetch(`/api/subject`, {
    method: "GET",
    cache: "force-cache",
  });
  return res.json();
};
