interface Answer {
  id: number;
  answer: string;
}

interface PairingBookProps {
  answers: Answer[];
}

export default function PairingBook({ answers }: PairingBookProps) {
  const questions = [
    {
      id: 1,
      question: "차 한 대, 기념일 한 끼, 신발 한켤레에 쓸 수 있는 최대 금액은?",
    },
    {
      id: 2,
      question: "살고싶은 신혼집 위치는?",
    },
    {
      id: 3,
      question: "내가 생각하는 이상적인 부부 월수입은?",
    },
  ];

  return (
    <div className="rounded-lg p-5 bg-white w-full space-y-5">
      <h2 className="text-hanagreen-normal font-semibold text-lg">페어링북</h2>
      {questions.map((q) => (
        <div key={q.id}>
          <p className="text-hanagreen-normal font-normal mb-2">
            Q{q.id}. <span className="text-black">{q.question}</span>
          </p>
          <p className="bg-hanagreen-light px-3 py-2 text-[0.9rem] rounded-md text-text-primary">
            {answers.find((a) => a.id === q.id)?.answer}
          </p>
        </div>
      ))}
    </div>
  );
}
