"use client";

import AnswerButton from "@/components/question/AnswerButton";

type Props = {
  answers: { content: string }[];
  selected: number | null;
  onSelect: (index: number) => void;
};

export default function AnswerButtonGroup({
  answers,
  selected,
  onSelect,
}: Props) {
  return (
    <div className="flex flex-col gap-3 items-center w-full max-w-[500px] mx-auto">
      {answers.map((answer, index) => (
        <AnswerButton
          key={index}
          content={answer.content}
          isSelected={selected === index}
          onClick={() => onSelect(index)}
        />
      ))}
    </div>
  );
}
