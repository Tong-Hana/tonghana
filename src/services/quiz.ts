import { QuizDetail, Subject, UserQuizLog } from "@/app/types/quiz";
import { customFetch } from "@/lib/customFetch";

export type QuizResponse = {
  subject: Subject;
};

export type QuizDetailResponse = {
  quiz: QuizDetail[];
};

export const fetchQuiz = async (): Promise<QuizResponse> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/subject`, {
    method: "GET",
  });
  return res.json();
};

export const fetchQuizLog = async (): Promise<UserQuizLog> => {
  return await customFetch<UserQuizLog>("/quiz-log", {
    method: "GET",
  });
};

export const fetchQuizDetail = async (): Promise<QuizDetailResponse> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/subject/quiz`, {
    method: "GET",
  });
  return res.json();
};

export const submitQuizLog = async (answer: boolean): Promise<UserQuizLog> => {
  return await customFetch<UserQuizLog>("/quiz-log", {
    method: "POST",
    body: JSON.stringify({
      answer: answer,
    }),
  });
};
