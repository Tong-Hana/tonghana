import Character from "@/assets/character/thumbs_up_stargirl.svg";
import { HanaAdCardProps } from "./types/HanaProducts";

export default function HanaAdCard({
  name,
  interestRate,
  period,
  subjectUrl,
}: HanaAdCardProps) {
  // 금액을 "5,000만원" 형태로 변환
  // const formatAmount = (amount: number) => {
  //   const million = Math.floor(amount / 10000);
  //   return `${million.toLocaleString()}만원`;
  // };

  return (
    <a
      href={subjectUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between bg-white rounded-xl shadow-[0px_1px_6px_0px_#00000040] px-6 py-4 w-full max-w-xl mt-5"
    >
      <div className="flex flex-col space-y-1">
        <p className="text-text-primary font-medium text-base">{name}</p>
        <p className="text-hanagreen-normal font-normal text-base">
          {interestRate}%
          <span className="text-text-secondary font-normal text-sm">
            {" "}
            (세전, {period})
          </span>
        </p>
        {/* <p className="text-text-primary text-sm">
          만기 시 최대{" "}
          <span className="text-hanared-normal font-normal">
            {formatAmount(maxAmount)}
          </span>{" "}
          저축 가능!
        </p> */}
      </div>

      <div className="h-[80px] relative">
        <Character className="w-full h-full object-contain" />
      </div>
    </a>
  );
}
