export type QuizDetail = {
  question: string;
  explanation: string;
  answer: boolean;
};

export type Quiz = {
  subjectType: string;
  description: string;
  title: string;
  features: string;
  period: string;
  amount: string;
  interestRate: string;
  subjectUrl: string;
};

export type UserQuizLog = {
  isPassed: boolean | null;
};
