export enum BadgeType {
  DILIGENT = "diligent",
  PLANNER = "planner",
  SAVER = "saver",
  INVESTOR = "investor",
}

export const BadgeTypeImagePathMap: Record<BadgeType, string> = {
  diligent: "/badge/diligent.png",
  planner: "/badge/hana.png",
  saver: "/badge/saver.png",
  investor: "/badge/investor.png",
};

export const BadgeTypeLabelMap: Record<BadgeType, string> = {
  diligent: "성실러",
  planner: "하나러",
  saver: "절약러",
  investor: "분산투자러",
};

export const BadgeTypeDescMap: Record<BadgeType, string> = {
  diligent: "하나은행 예금/적금 만기 시",
  planner: "하나은행 정기예금/적금 가입",
  saver: "최근 3개월 동안 소득 대비\n소비 비율이 60% 이하",
  investor: "하나은행에서 판매하는\n예금/적금을 제외한\n투자 상품 가입 시",
};
