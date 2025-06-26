"use client";

import Button from "@/components/common/button/Button";
import { quizLogQueryOptions, useQuizLog } from "@/hooks/useQuiz";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import DialogButton from "@/components/common/button/DialogButton";
import { useState } from "react";

export default function QuizButton() {
  const [showDialog, setShowDialog] = useState(false);

  const { data, isLoading, isError } = useQuery(quizLogQueryOptions());
  const router = useRouter();

  const submitUserQuizLogMutation = useQuizLog(
    () => {},
    () => {},
  );

  const submitQuiz = async () => {
    setShowDialog(true);
  };

  const goToQuiz = () => {
    if (data?.isPassed === null) {
      submitUserQuizLogMutation.mutate(false);
      router.push("/quiz-detail");
    } else {
      router.push("/quiz-detail");
    }
  };

  const closeDialog = () => {
    setShowDialog(false);
  };

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
    <>
      <DialogButton
        title={"⚠️ 주의하세요!"}
        content={
          "퀴즈를 시작하면 중간에 종료하거나 \n이탈할 경우 오답으로 처리됩니다.\n" +
          "반드시 끝까지 풀고 제출해 주세요."
        }
        open={showDialog}
        onAction={goToQuiz}
        onClose={closeDialog}
      />
      <Button
        loading={isLoading}
        intent={data?.isPassed !== null ? "default" : "green"}
        label={
          data?.isPassed !== null ? "이미 퀴즈를 풀었어요" : "퀴즈 풀러가기"
        }
        size="full"
        onClick={() => {
          if (data?.isPassed === null) {
            submitQuiz();
          }
        }}
      />
    </>
  );
}
