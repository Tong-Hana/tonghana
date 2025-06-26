"use client";

const chatPreset = [
  "혹시 경제 뉴스나 재테크 콘텐츠 자주 보세요?",
  "처음 투자를 시작하게 된 계기가 궁금해요!",
  "가장 관심 있는 금융 분야가 있다면요? (예: 주식, 펀드, 부동산 등)",
  "본인이 생각하는 '좋은 금융 습관'이 있다면 알려주세요!",
];

type Props = {
  onSelectPreset: (text: string) => void;
};

export default function ChatPreset({ onSelectPreset }: Props) {
  return (
    <div className="px-5 pt-3 bg-background shadow-inner rounded-t-3xl">
      {chatPreset.map((preset, idx) => (
        <button
          key={idx}
          type="button"
          onClick={() => onSelectPreset(preset)}
          className="py-1 text-text-secondary text-sm text-start w-full font-normal hover:bg-black/5"
        >
          {preset}
        </button>
      ))}
    </div>
  );
}
