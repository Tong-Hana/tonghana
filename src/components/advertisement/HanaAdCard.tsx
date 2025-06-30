import { HanaAdCardProps } from "./types/HanaProducts";
import InfoCard from "../common/InfoCard";

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
    <a href={subjectUrl} target="_blank" rel="noopener noreferrer">
      <div className="mt-5">
        <InfoCard
          content={
            <>
              <span className="text-text-primary font-medium text-base">
                {name}
              </span>
              <br />
              <span className="text-hanagreen-normal font-normal text-base">
                {interestRate}%
                <span className="text-text-secondary font-normal text-sm">
                  {" "}
                  (세전, {period})
                </span>
              </span>
            </>
          }
          imageType="thumbsUpStarGirl"
        />
      </div>
    </a>
  );
}
