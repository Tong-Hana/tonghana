"use client";

import Button from "@/components/common/button/Button";
import Header from "@/components/common/Header";
import { useState } from "react";
import DotIndicator from "@/components/intro/DotIndicator";
import { SelectO, SelectX } from "@/assets/assets";
import QuizAnswerModal from "@/components/quiz/QuizAnswerModal";
import { QuizDetail } from "@/app/types/quiz";

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
  const [showModal, setShowModal] = useState(false);
  const [fullAnswer, setFullAnswer] = useState<boolean | null>(null);
  const selectCardStyle =
    "shadow-card-shadow rounded-3xl p-12 w-[45%] aspect-square flex justify-center items-center";

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
  };

  const submitAnswer = () => {
    if (answer === null) {
      alert("답변을 선택해주세요.");
      return;
    } else {
      setShowModal(true);

      if (fullAnswer === null) {
        setFullAnswer(answer === quizData[idx].answer);
      } else {
        if (fullAnswer) {
          setFullAnswer(answer === quizData[idx].answer);
        }
      }
    }
  };

  const nextQuiz = () => {
    if (idx + 1 < quizData.length) {
      setIdx(idx + 1);
      setAnswer(null);
    } else {
      //TODO 퀴즈 완료후 로직 추가
      alert(`${fullAnswer ? "정답" : "오답"} 모든 퀴즈를 완료했습니다!`);
    }
    setShowModal(false);
  };

  const stopQuiz = () => {
    //TODO 퀴즈 중단시 로직 추가
  };

  return (
    <div>
      <Header
        title={`Quiz ${idx + 1}`}
        centerTitle={false}
        showBackButton={false}
      />
      <div className={"flex flex-col justify-center h-[80vh]"}>
        <div className="flex flex-col gap-4">
          <div className="flex items-start">
            <DotIndicator total={quizData.length} current={idx} />
          </div>
          <div className="text-2xl text-text-primary leading-8">
            {quizData[idx].question}
          </div>
        </div>
        <div className="flex flex-1 justify-between items-center">
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
      <QuizAnswerModal
        title={answer === quizData[idx].answer ? "맞았어요!" : "틀렸어요!"}
        content={quizData[idx].explanation}
        onAction={nextQuiz}
        open={showModal}
        onClose={stopQuiz}
        isEnd={quizData.length === idx + 1}
        isCorrect={answer === quizData[idx].answer}
      />
    </div>
  );
}
