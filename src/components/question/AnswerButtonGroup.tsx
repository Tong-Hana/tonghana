"use client";

import { useState } from "react";
import AnswerButton from "./AnswerButton";

type Props = {
  answers: {
    content: string;
  }[];
};

export default function AnswerButtonGroup({ answers }: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleSelectAnswer = (index: number) => {
    setSelectedIndex(selectedIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col gap-3 items-center">
      {answers.map((answer, index) => (
        <div key={index}>
          <AnswerButton
            content={answer.content}
            isSelected={selectedIndex === index}
            onClick={() => handleSelectAnswer(index)}
          />
        </div>
      ))}
    </div>
  );
}
