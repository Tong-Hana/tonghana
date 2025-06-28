export enum BadgeType {
  DILIGENT = "diligent",
  PLANNER = "planner",
  SAVER = "saver",
  INVESTOR = "investor",
}

export const BadgeTypeImagePathMap: Record<BadgeType, string> = {
  diligent: "/badge/diligent.png",
  planner: "/badge/planner.png",
  saver: "/badge/saver.png",
  investor: "/badge/investor.png",
};

export const BadgeTypeLabelMap: Record<BadgeType, string> = {
  diligent: "성실러",
  planner: "계획러",
  saver: "절약러",
  investor: "분산투자러",
};

export const BadgeTypeDescMap: Record<BadgeType, string> = {
  diligent: "하나은행 정기예금/적금 가입",
  planner: "목표 설정 적금 2회 이상",
  saver: "월 소비 항목 10건 이하인 달이 3회 이상",
  investor: "자산 포트폴리오에서 3개 이상 자산 비중이 20% 이상",
};
