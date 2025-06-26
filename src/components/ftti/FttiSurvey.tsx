"use client";

import { QUESTIONS } from "@/constants/questions";
import Header from "@/components/common/Header";
import InfoCard from "@/components/common/InfoCard";
import QuestionCard from "@/components/question/QuestionCard";
import AnswerButtonGroup from "@/components/question/AnswerButtonGroup";
import Button from "@/components/common/button/Button";
import { useFttiMutation } from "@/hooks/useFttiMutation";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useFttiStore } from "@/lib/store/fttiStore";
import { useQueryClient } from "@tanstack/react-query";

interface FttiSurveyProps {
  title?: string;
  infoMessage?: React.ReactNode;
  onSuccess?: () => void;
  isRetake?: boolean;
}

export default function FttiSurvey({
  title = "FTTI 설문",
  infoMessage,
  onSuccess,
  isRetake = false,
}: FttiSurveyProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { selectedAnswers, setAnswer, isComplete, clearAnswers } =
    useFttiStore();

  const fttiMutation = useFttiMutation({
    onSuccess: async (data) => {
      clearAnswers();

      if (isRetake) {
        toast.success("FTTI 설문이 완료되었습니다!");

        // 프로필 관련 캐시 무효화
        await queryClient.invalidateQueries({ queryKey: ["userProfile"] });
        await queryClient.refetchQueries({ queryKey: ["userProfile"] });

        // 마이페이지로 돌아가기
        setTimeout(() => {
          router.push("/profile");
        }, 1000);
      } else {
        // 온보딩의 경우 결과 페이지로 이동
        router.push(`/result?type=${data.resultType}`);
      }

      // 커스텀 성공 콜백이 있으면 실행
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: () => {
      toast.error("제출에 실패했습니다. 다시 시도해주세요.");
    },
  });

  const handleSelect = (
    questionIndex: number,
    answerIndex: number | number[],
  ) => {
    setAnswer(questionIndex, answerIndex);
  };

  const handleSubmit = () => {
    if (!isComplete()) return;

    // 0부터 시작하는 인덱스를 1부터 시작하는 선택지 번호로 변환
    const answers = selectedAnswers.map((ans) => {
      if (ans === null) return 1; // null인 경우 첫 번째 선택지로 기본값
      if (Array.isArray(ans)) {
        return ans.map((idx) => idx + 1); // 배열의 각 요소에 +1
      }
      return ans + 1; // 단일 값에 +1
    }) as (number | number[])[];

    console.log("변환된 답변:", answers);
    fttiMutation.mutate({ answers });
  };

  const defaultInfoMessage = (
    <>
      나는 어떤 투자 스타일일까? <br />
      8개의 FTTI(Financial Type Test Indicator) 질문으로 <br />
      나의 <span className="text-hanagreen-normal">투자 성향</span>을
      알아보세요!
    </>
  );

  return (
    <div className="px-4 py-6 space-y-6 bg-hanagreen-normal min-h-screen">
      <Header title={title} color="white" className="bg-hanagreen-normal" />

      <InfoCard
        content={infoMessage || defaultInfoMessage}
        imageType="infoStarBoy"
      />

      {QUESTIONS.map(({ index, question, answers, multiple }, i) => (
        <QuestionCard key={index} index={index} question={question}>
          <AnswerButtonGroup
            answers={answers}
            selected={selectedAnswers[i]}
            multiple={multiple}
            onSelect={(value) => handleSelect(i, value)}
          />
        </QuestionCard>
      ))}

      <div className="pt-6">
        <Button
          intent={isComplete() ? "black" : "default"}
          size="full"
          label={fttiMutation.isPending ? "제출 중..." : "제출"}
          onClick={handleSubmit}
          disabled={!isComplete() || fttiMutation.isPending}
        />
      </div>
    </div>
  );
}
