"use client";

import Button from "@/components/common/button/Button";
import Header from "@/components/common/Header";
import { useState } from "react";
import DotIndicator from "@/components/intro/DotIndicator";
import { SelectO, SelectX } from "@/assets/assets";

type QuizDetail = {
  question: string;
  explanation: string;
  answer: boolean;
};
// 더미데이터
const quizData: QuizDetail[] = [
  {
    question:
      "하나의 정기예금은 계약기간과 가입금액 모두 자유롭게 설정할 수 있다.",
    explanation: "하나의 정기예금은 계약기간 및 가입금액이 자유로워요",
    answer: true,
  },
  {
    question: "하나의 정기예금은 최대 10년까지 가입기간을 정할 수 있다.",
    explanation:
      "하나의 정기예금은 1개월 이상 5년 이내 일단위로 가입기간을 정할 수 있어요",
    answer: false,
  },
  {
    question: "하나의 정기예금은 가입금액이 1백만원 이상이어야 한다.",
    explanation:
      "하나의 정기예금 가입금액은 최소 1백만원 부터 금액을 자유롭게 정할 수 있어요",
    answer: true,
  },
];

export default function QuizDetailPage() {
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState<boolean | null>(null);
  const selectCardStyle =
    "shadow-card-shadow rounded-3xl p-12 w-[45%] aspect-square flex justify-center items-center";
  const submitAnswer = () => {
    if (answer === null) {
      alert("답변을 선택해주세요.");
      return;
    }
  };

  const makeSelectCardStyle = (bool: boolean) => {
    if (answer === null) {
      return selectCardStyle + " bg-white";
    } else if (answer === bool) {
      return selectCardStyle + " bg-hanagreen-light border-hanagreen-normal";
    } else {
      return selectCardStyle + " bg-white";
    }
  };
  const chooseAnswer = (bool: boolean) => {
    if (answer === null) {
      setAnswer(bool);
    } else {
      if (answer === bool) {
        setAnswer(null);
      } else {
        setAnswer(bool);
      }
    }
    setIdx(idx + 1);
  };
  return (
    <div>
      <Header
        title={`Quiz ${idx + 1}`}
        centerTitle={false}
        showBackButton={false}
      />
      <div className={"flex flex-col justify-center"}>
        <div className="flex items-start pb-4">
          <DotIndicator total={quizData.length} current={idx} />
        </div>
        <div className="text-2xl text-text-primary leading-8">
          {quizData[idx].question}
        </div>
        <div className="flex justify-between items-center">
          <div
            className={makeSelectCardStyle(true)}
            onClick={() => chooseAnswer(true)}
          >
            <SelectO className="w-full h-full overflow-visible" />
          </div>
          <div
            className={makeSelectCardStyle(false)}
            onClick={() => chooseAnswer(false)}
          >
            <SelectX className="w-full h-full overflow-visible" />
          </div>
        </div>
        <div className="fixed bottom-12 left-0 right-0 w-full px-5 py-3">
          <Button
            intent={"green"}
            size={"full"}
            label="완료"
            onClick={() => submitAnswer()}
          />
        </div>
      </div>
    </div>
  );
}
