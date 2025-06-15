"use client";

import clsx from "clsx";

type Props = {
  content: string;
  isSelected: boolean;
  onClick: () => void;
};

export default function AnswerButton({ content, isSelected, onClick }: Props) {
  return (
    <button
      className={clsx(
        "w-full px-4 py-3 rounded-xl border text-text-primary text-base font-normal text-left whitespace-pre-wrap",
        isSelected
          ? "border-hanagreen-normal bg-hanagreen-light shadow-md"
          : "border-hanasilver bg-white",
      )}
      type="button"
      onClick={onClick}
    >
      {content}
    </button>
  );
}
