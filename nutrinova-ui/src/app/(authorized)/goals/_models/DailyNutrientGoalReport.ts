import { NutrientGoalReportItem } from "./NutrientGoalReportItem";


export interface DailyNutrientGoalReport {
  date: Date;
  nutrientGoalReportItems: NutrientGoalReportItem[];
}
