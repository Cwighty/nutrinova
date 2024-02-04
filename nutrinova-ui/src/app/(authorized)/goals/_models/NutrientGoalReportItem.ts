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

enum NutrientGoalStatus {
  NotMet,
  Met,
  Exceeded,
}