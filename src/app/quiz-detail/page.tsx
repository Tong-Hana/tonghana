"use client";

import Button from "@/components/common/button/Button";
import Header from "@/components/common/Header";
import { useEffect, useState } from "react";
import DotIndicator from "@/components/intro/DotIndicator";
import { SelectO, SelectX } from "@/assets/assets";
import QuizAnswerModal from "@/components/quiz/QuizAnswerModal";
import { useSuspenseQuery } from "@tanstack/react-query";
import { quizDetailQueryOptions, usePatchQuizLog } from "@/hooks/useQuiz";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function QuizDetailPage() {
  const { data } = useSuspenseQuery(quizDetailQueryOptions());
  const quizData = data.quiz;
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState<boolean | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [fullAnswer, setFullAnswer] = useState<boolean | null>(null);
  const router = useRouter();

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

  const submitUserQuizLogMutation = usePatchQuizLog(
    () => {
      toast.success("퀴즈가 종료되었습니다.");
    },
    () => {
      toast.error("퀴즈 제출에 실패했습니다. 다시 시도해주세요.");
    },
  );

  const nextQuiz = () => {
    if (idx + 1 < quizData.length) {
      setIdx(idx + 1);
      setAnswer(null);
    } else {
      submitUserQuizLogMutation.mutate(fullAnswer ?? false);
      router.push("/quiz");
    }
    setShowModal(false);
  };

  const stopQuiz = () => {
    submitUserQuizLogMutation.mutate(false);
    router.push("/quiz");
  };
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

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
        <div className="fixed bottom-0 left-0 right-0 w-full px-5 py-3">
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
        fullAnswer={!!fullAnswer}
      />
    </div>
  );
}
