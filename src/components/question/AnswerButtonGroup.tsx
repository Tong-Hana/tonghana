"use client";

import AnswerButton from "@/components/question/AnswerButton";

type Props = {
  answers: { content: string }[];
  selected: number | number[] | null;
  onSelect: (updated: number | number[]) => void;
  multiple?: boolean;
};

export default function AnswerButtonGroup({
  answers,
  selected,
  onSelect,
  multiple = false,
}: Props) {
  const isSelected = (index: number) =>
    multiple
      ? Array.isArray(selected) && selected.includes(index)
      : selected === index;

  const handleClick = (index: number) => {
    if (multiple) {
      if (!Array.isArray(selected)) return onSelect([index]);
      const exists = selected.includes(index);
      const updated = exists
        ? selected.filter((i) => i !== index)
        : [...selected, index];
      onSelect(updated);
    } else {
      onSelect(index);
    }
  };

  return (
    <div className="flex flex-col gap-3 items-center w-full max-w-[500px] mx-auto">
      {answers.map((answer, index) => (
        <AnswerButton
          key={index}
          content={answer.content}
          isSelected={isSelected(index)}
          onClick={() => handleClick(index)}
        />
      ))}
    </div>
  );
}
