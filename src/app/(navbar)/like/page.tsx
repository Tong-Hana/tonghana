"use client";

import {
  GoalPeriod,
  GoalType,
  goalUtils,
  InvestmentTypeLabelMap,
} from "@/app/types/profiles";
import LikeCard from "@/components/like/LikeCard";
import { useReceivedLikes } from "@/hooks/useReceivedLikes";
import { formatAmount } from "@/lib/utils/formatAmount";

export default function LikePage() {
  const { data, isLoading, isError } = useReceivedLikes();

  if (isLoading || isError || data?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center content-h">
        <p className="text-text-secondary text-base ">
          {isLoading
            ? "받은 좋아요 불러오는 중..."
            : isError
              ? `새로고침을 시도해주세요`
              : "아직 받은 좋아요가 없어요."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col mb-5 w-full h-full mt-5 gap-5">
      {data?.map((matchData) => {
        const goalType =
          goalUtils.enumToTag(matchData.sent.goalType as GoalType) || "";
        const goalPeriod =
          goalUtils.periodValueToOption(
            matchData.sent.goalPeriod as GoalPeriod,
          ) || "";
        const goalAmount = matchData.sent.goalAmount
          ? formatAmount(matchData.sent.goalAmount)
          : "";

        const goal = `${goalType} ${goalAmount} 모으기! (${goalPeriod})`;

        return (
          <LikeCard
            key={matchData.matchId}
            userId={matchData.sent.userId}
            matchId={matchData.matchId}
            imageUrl={matchData.sent.profileImage}
            name={matchData.sent.nickname}
            age={matchData.sent.age}
            address={matchData.sent.city}
            goal={goal}
            investmentType={InvestmentTypeLabelMap[matchData.sent.currentType]}
          />
        );
      })}
    </div>
  );
}
