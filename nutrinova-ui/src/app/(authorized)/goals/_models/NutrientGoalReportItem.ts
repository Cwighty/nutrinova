import { UnitOption } from "../../food/_models/unitOption";

export interface NutrientGoalReportItem {
  nutrientId: number;
  nutrientName: string;
  preferredUnit: UnitOption;
  customTargetAmount: GoalTargetAmount;
  recommendedTargetAmount: GoalTargetAmount;
  consumedAmount: number;
  goalStatus: NutrientGoalStatus;
}

export interface GoalTargetAmount {
  LowerLimit: number;
  UpperLimit: number;
  MaxLimit: number;
  Type: string;
}

export enum NutrientGoalStatus {
  NotStarted,
  NotMet,
  Met,
  Exceeded,
}