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

export interface DailyNutrientGoalReport {
  date: Date;
  nutrientGoalReportItems: NutrientGoalReportItem[];
}

export interface GoalTargetAmount {
  lowerLimit: number;
  upperLimit: number;
  maxLimit: number;
  type: string;
}

export enum NutrientGoalStatus {
  NotStarted = 0,
  NotMet = 1,
  Met = 2,
  Exceeded = 3,
}