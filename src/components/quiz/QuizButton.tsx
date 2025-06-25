"use client";

import Button from "@/components/common/button/Button";
import { UserQuizLog } from "@/app/types/quiz";

export default function QuizButton() {
  //TODO: userQuizLog 불러오기
  const dummyLog: UserQuizLog = {
    isPassed: null,
  };

  return (
    <Button
      intent={dummyLog?.isPassed !== null ? "default" : "green"}
      label={
        dummyLog?.isPassed !== null ? "이미 퀴즈를 풀었어요" : "퀴즈 풀러가기"
      }
      size="full"
      onClick={() => {}}
    />
  );
}
