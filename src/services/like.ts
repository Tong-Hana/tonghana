import {
  GoalPeriod,
  GoalType,
  InvestmentType,
  MatchStatus,
} from "@/lib/constants/enums";

export interface MatchLikeResponse {
  matchId: number;
  matchStatus: MatchStatus;
  sent: {
    userId: number;
    nickname: string;
    profileImage: string;
    birthYear: number;
    age: number;
    city: string;
    currentType: InvestmentType;
    goalType: GoalType;
    goalAmount: number;
    goalPeriod: GoalPeriod;
  };
}

export const fetchReceivedLikes = async (): Promise<MatchLikeResponse[]> => {
  const res = await fetch("/api/likes/received");

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message ?? "받은 좋아요 조회에 실패했습니다.");
  }

  const parsedData = (await res.json()) as MatchLikeResponse[];

  return parsedData.map((data) => ({
    ...data,
    sent: {
      ...data.sent,
      age: new Date(Date.now()).getFullYear() - data.sent.birthYear + 1,
    },
  }));
};
