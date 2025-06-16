import { User } from "@prisma/client";
import { prisma } from "@/lib/prisma";

// 사용자의 매칭 상대를 찾는 함수
// 매칭 로그에 존재하지 않는 상대 중에서 현재 또는 선호하는 투자성향이 일치하는 사용자를 매칭시킵니다.
export async function getMatchPartner(user: User) {
  const oppositeGender = user.gender === "M" ? "F" : "M";

  const matchLogs = await prisma.userMatchLog.findMany({
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

  return prisma.user.findMany({
    where: {
      userId: {
        notIn: Array.from(matchedUserIds),
      },
      gender: oppositeGender,
      isDeleted: false,
      OR: [
        { currentType: user.currentType },
        { preferredType: user.preferredType },
        { preferredType: user.currentType },
        { currentType: user.preferredType },
      ],
    },
  });
}
