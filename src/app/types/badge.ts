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
