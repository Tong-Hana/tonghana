import { GoalType, GoalPeriod } from "@/lib/constants/enums";

export const GOAL_TAGS = [
  "내 집 마련",
  "목돈 마련",
  "노후 자금",
  "결혼 자금",
] as const;

export const GOAL_PERIOD_OPTIONS = [
  "1년 이내",
  "3년 이내",
  "5년 이내",
  "5년 이상",
] as const;

export type GoalTag = (typeof GOAL_TAGS)[number];
export type GoalPeriodOption = (typeof GOAL_PERIOD_OPTIONS)[number];

export const goalUtils = {
  tagToEnum: (tag: GoalTag): GoalType => {
    const index = GOAL_TAGS.indexOf(tag);
    const enumValues = Object.values(GoalType);
    return enumValues[index];
  },

  enumToTag: (enumValue: GoalType): GoalTag => {
    const enumValues = Object.values(GoalType);
    const index = enumValues.indexOf(enumValue);
    return GOAL_TAGS[index];
  },

  periodOptionToValue: (option: GoalPeriodOption): GoalPeriod => {
    const index = GOAL_PERIOD_OPTIONS.indexOf(option);
    const enumValues = Object.values(GoalPeriod);
    return enumValues[index];
  },

  periodValueToOption: (value: GoalPeriod): GoalPeriodOption => {
    const enumValues = Object.values(GoalPeriod);
    const index = enumValues.indexOf(value);
    return GOAL_PERIOD_OPTIONS[index];
  },

  getEnumFromSelectedTag: (selectedTag: GoalTag | null): GoalType | null => {
    if (!selectedTag) return null;
    return goalUtils.tagToEnum(selectedTag);
  },

  getValueFromSelectedPeriod: (
    selectedPeriod: GoalPeriodOption | null,
  ): GoalPeriod | null => {
    if (!selectedPeriod) return null;
    return goalUtils.periodOptionToValue(selectedPeriod);
  },
};
