import {
  GoalPeriod,
  GoalType,
  InvestmentType,
  MatchStatus,
} from "@/lib/constants/enums";
import { customFetch } from "@/lib/customFetch";

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

export type LikeResponse = {
  message: string;
};

export const acceptLike = async (matchId: number): Promise<LikeResponse> => {
  const res = await customFetch<LikeResponse>("/likes/accept", {
    method: "PATCH",
    body: JSON.stringify({
      matchId: matchId,
    }),
  });

  return res;
};

export const rejectLike = async (matchId: number): Promise<LikeResponse> => {
  const res = await customFetch<LikeResponse>("/likes/reject", {
    method: "PATCH",
    body: JSON.stringify({
      matchId: matchId,
    }),
  });

  return res;
};
