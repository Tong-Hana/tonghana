import { User } from "@prisma/client";
import { InvestmentType } from "@/lib/constants/enums";
import { investmentTypeToVector } from "@/lib/actions/saveUserVector";
import { client } from "../weaviate";
import { replicaPrisma } from "../prisma/replicaClient";
import { masterPrisma } from "../prisma/masterClient";

type WeaviateCandidate = {
  userId: string;
  gender: string;
  currentType: InvestmentType;
  preferredType: InvestmentType;
  _additional: {
    id: string; // Weaviate 내부 ID (UUID)
  };
};

// 코사인 유사도 계산 함수
const cosineSimilarity = (a: number[], b: number[]): number => {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (normA * normB);
};

const calcMutualSimilarity = (
  aCurrent: InvestmentType,
  aPreferred: InvestmentType,
  bCurrent: InvestmentType,
  bPreferred: InvestmentType,
): number => {
  const aCurrVec = investmentTypeToVector(aCurrent);
  const aPrefVec = investmentTypeToVector(aPreferred);
  const bCurrVec = investmentTypeToVector(bCurrent);
  const bPrefVec = investmentTypeToVector(bPreferred);

  const sim1 = cosineSimilarity(aCurrVec, bPrefVec); // 나의 현재 ↔ 너의 이상
  const sim2 = cosineSimilarity(bCurrVec, aPrefVec); // 너의 현재 ↔ 나의 이상

  return sim1 * 0.4 + sim2 * 0.6; // 가중치 조정
};

// 사용자의 매칭 상대를 찾는 함수
// 매칭 로그에 존재하지 않는 상대 중에서 현재 또는 선호하는 투자성향이 일치하는 사용자를 매칭시킵니다.
export async function makeMatchPartner(user: User, findNum: number) {
  const oppositeGender = user.gender === "M" ? "F" : "M";

  // 오늘 생성된 추천 기록 확인
  const now = new Date();
  const startOfToday = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
  const startOfTomorrow = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1),
  );
  const count = await replicaPrisma.userRecoLog.count({
    where: {
      baseUserId: user.userId,
      createdAt: {
        gte: startOfToday,
        lt: startOfTomorrow,
      },
    },
  });

  if (count === findNum) {
    return;
  }

  const matchLogs = await replicaPrisma.userMatchLog.findMany({
    where: {
      OR: [{ sentId: user.userId }, { receiveId: user.userId }],
    },
    select: {
      sentId: true,
      receiveId: true,
    },
  });

  const matchedUserIds = new Set<number>();
  matchLogs.forEach((log) => {
    matchedUserIds.add(log.sentId);
    matchedUserIds.add(log.receiveId);
  });
  matchedUserIds.add(user.userId);

  const rawCandidates = await client.graphql
    .get()
    .withClassName("User")
    .withNearVector({
      vector: investmentTypeToVector(user.preferredType as InvestmentType),
    }) // 내가 원하는 투자성향
    .withWhere({
      path: ["gender"],
      operator: "Equal",
      valueText: oppositeGender,
    })
    .withFields("userId gender currentType preferredType _additional { id }")
    .withLimit(100)
    .do();

  const candidates: WeaviateCandidate[] = rawCandidates.data.Get.User;
  const slice = candidates
    .filter((candidate) => {
      const id = parseInt(candidate.userId, 10);
      return !matchedUserIds.has(id);
    })
    .map((candidate) => {
      const score = calcMutualSimilarity(
        user.currentType as InvestmentType,
        user.preferredType as InvestmentType,
        candidate.currentType as InvestmentType,
        candidate.preferredType as InvestmentType,
      );

      return {
        userId: parseInt(candidate.userId, 10),
        gender: candidate.gender,
        currentType: candidate.currentType,
        preferredType: candidate.preferredType,
        mutualScore: score,
      };
    })
    .sort((a, b) => b.mutualScore - a.mutualScore)
    .slice(0, findNum);
  for (let i = count + 1; i < slice.length; i++) {
    const result = slice[i];
    await masterPrisma.userRecoLog.create({
      data: {
        baseUserId: user.userId,
        candidateId: result.userId,
      },
    });
  }
  return;
}
