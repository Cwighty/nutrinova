import { NutrientGoalReportItem } from "./NutrientGoalReportItem";

export interface PatientNutrientGoalReport {
  patientId: string;
  patientName: string;
  reportBegin: Date;
  reportEnd: Date;
  nutrientGoalReportItems: NutrientGoalReportItem[];
}
