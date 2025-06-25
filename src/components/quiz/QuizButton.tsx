"use client";

import Button from "@/components/common/button/Button";
import { quizLogQueryOptions } from "@/hooks/useQuiz";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function QuizButton() {
  const { data, isLoading, isError } = useQuery(quizLogQueryOptions());
  const router = useRouter();

  if (isError) {
    return (
      <Button
        intent="red"
        label="현재 퀴즈를 풀 수 없습니다"
        size="full"
        onClick={() => {}}
      />
    );
  }

  return (
    <Button
      loading={isLoading}
      intent={data?.isPassed !== null ? "default" : "green"}
      label={data?.isPassed !== null ? "이미 퀴즈를 풀었어요" : "퀴즈 풀러가기"}
      size="full"
      onClick={() => {
        router.push("/quiz-detail");
      }}
    />
  );
}
