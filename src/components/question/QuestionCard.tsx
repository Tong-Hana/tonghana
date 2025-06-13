import { PropsWithChildren } from "react";

type Props = {
  index?: number;
  question: string;
};

export default function QuestionCard({
  index,
  question,
  children,
}: PropsWithChildren<Props>) {
  return (
    <div className="p-5 flex flex-col bg-white rounded-3xl">
      <div className="flex mb-5">
        <p className="text-lg font-semibold text-hanagreen-normal">{`Q${index ? index : ""}.`}</p>
        <p className="ml-1 text-lg font-normal text-text-primary">{question}</p>
      </div>
      {children}
    </div>
  );
}
