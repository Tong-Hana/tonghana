"use client";

import { useState } from "react";
import { QUESTIONS } from "@/constants/questions";
import Header from "@/components/common/Header";
import InfoCard from "@/components/common/InfoCard";
import QuestionCard from "@/components/question/QuestionCard";
import AnswerButtonGroup from "@/components/question/AnswerButtonGroup";
import Button from "@/components/common/button/Button";

export default function QuestionPage() {
  const [selectedIndices, setSelectedIndices] = useState<(number | null)[]>(
    Array(QUESTIONS.length).fill(null),
  );

  const handleSelect = (questionIndex: number, answerIndex: number) => {
    const updated = [...selectedIndices];
    updated[questionIndex] = answerIndex;
    setSelectedIndices(updated);
  };

  const isComplete = selectedIndices.every((i) => i !== null);

  return (
    <div className="px-4 py-6 space-y-6 bg-hanagreen-normal min-h-screen">
      <Header title="FTTI 설문" color="white" className="bg-hanagreen-normal" />

      <InfoCard
        content={
          <>
            나는 어떤 투자 스타일일까? <br />
            10개의 질문으로 <br />
            나에게 맞는 <span className="text-hanagreen-normal">투자 성향</span>
            을 찾아보세요!
          </>
        }
        imageType="infoStarBoy"
      />

      {QUESTIONS.map(({ index, question, answers }, i) => (
        <QuestionCard key={index} index={index} question={question}>
          <AnswerButtonGroup
            answers={answers}
            selected={selectedIndices[i]}
            onSelect={(answerIndex) => handleSelect(i, answerIndex)}
          />
        </QuestionCard>
      ))}

      <div className="pt-6">
        <Button
          intent={isComplete ? "black" : "default"}
          size="full"
          label="제출"
          onClick={() => {
            if (!isComplete) {
              return;
            }
          }}
        />
      </div>
    </div>
  );
}
