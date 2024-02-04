import { UnitOption } from "../../food/_models/unitOption";

export interface NutrientGoalReportItem {
  nutrientId: number;
  nutrientName: string;
  preferredUnit: UnitOption;
  dailyGoalAmount: number;
  consumedAmount: number;
  remainingAmount: number;
  goalStatus: NutrientGoalStatus;
}

export enum NutrientGoalStatus {
  NotStarted,
  NotMet,
  Met,
  Exceeded,
}

export type NutrientGoalStatusDisplayType = {
  [key in number]: string;
};

export const NutrientGoalStatusDisplay: NutrientGoalStatusDisplayType = {
  [NutrientGoalStatus.NotStarted]: "Not Started",
  [NutrientGoalStatus.NotMet]: "Not Met",
  [NutrientGoalStatus.Met]: "Met",
  [NutrientGoalStatus.Exceeded]: "Exceeded",
};
