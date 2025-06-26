import { QuizDetail, Subject, UserQuizLog } from "@/app/types/quiz";
import { customFetch } from "@/lib/customFetch";

export type QuizResponse = {
  subject: Subject;
};

export type QuizDetailResponse = {
  quiz: QuizDetail[];
};

export const fetchQuiz = async (): Promise<QuizResponse> => {
  return await customFetch<QuizResponse>("/subject", {
    method: "GET",
  });
};

export const fetchQuizLog = async (): Promise<UserQuizLog> => {
  return await customFetch<UserQuizLog>("/quiz-log", {
    method: "GET",
  });
};

export const fetchQuizDetail = async (): Promise<QuizDetailResponse> => {
  return await customFetch<QuizDetailResponse>("/subject/quiz", {
    method: "GET",
  });
};

export const submitQuizLog = async (answer: boolean): Promise<UserQuizLog> => {
  return await customFetch<UserQuizLog>("/quiz-log", {
    method: "POST",
    body: JSON.stringify({
      answer: answer,
    }),
  });
};

export const patchQuizLog = async (answer: boolean): Promise<UserQuizLog> => {
  return await customFetch<UserQuizLog>("/quiz-log", {
    method: "PATCH",
    body: JSON.stringify({
      answer: answer,
    }),
  });
};
