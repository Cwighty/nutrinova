import { DailyNutrientGoalReport } from "./NutrientGoalReportItem";


export interface PatientNutrientReport {
  patientId: string;
  patientName: string;
  daysAchievedCount: number;
  maxConsumption: number;
  avgConsumption: number;
  days: DailyNutrientGoalReport[];
}
