import { NutrientGoalReportItem } from "./NutrientGoalReportItem";

export interface PatientNutrientGoalReport {
  patientName: string;
  reportBegin: Date;
  reportEnd: Date;
  nutrientGoalReportItems: NutrientGoalReportItem[];
}