import { UserBadge } from "@prisma/client";

export function calBadgeCount(badges: UserBadge): number {
  const badgeCnt =
    badges.diligent + badges.investor + badges.planner + badges.saver;
  return badgeCnt;
}
