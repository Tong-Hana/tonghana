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
  const [showModal, setShowModal] = useState(false);
  //TODO 퀴즈 정답여부 저장하는 로직 필요
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
    }
  };

  const nextQuiz = () => {
    if (idx + 1 < quizData.length) {
      setIdx(idx + 1);
      setAnswer(null);
    } else {
      //TODO 퀴즈 완료후 로직 추가
      alert("모든 퀴즈를 완료했습니다!");
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
      <Modal
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

function Modal({
  title,
  content,
  open,
  onAction,
  onClose,
  isEnd,
  isCorrect,
}: {
  title: string;
  content: string;
  open?: boolean;
  onAction: () => void;
  onClose: () => void;
  isEnd: boolean;
  isCorrect: boolean;
}) {
  const showModal = open ?? true;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
          onClick={handleBackdropClick}
        >
          <div className="rounded-3xl border border-background bg-white mx-5 px-8 pt-6 pb-5 shadow-sm w-full max-w-80">
            <h2 className="mb-4 text-xl font-semibold text-hanagreen-normal">
              {title}
            </h2>

            <p className="mb-6 text-base text-text-primary">{content}</p>

            <div className="flex w-full gap-4 px-0">
              {isEnd || isCorrect ? (
                <></>
              ) : (
                <Button
                  className="rounded-lg"
                  intent="black"
                  size="full"
                  onClick={onClose}
                >
                  그만 두기
                </Button>
              )}
              <Button
                className="rounded-lg"
                intent="green"
                size="full"
                onClick={onAction}
              >
                {isEnd ? "완료" : "다음 문제"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
