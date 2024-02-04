import { UnitOption } from "../../food/_models/unitOption";

export interface NutrientGoalResponse {
  id: string;
  patientId: string;
  patientName: string;
  nutrientId: number;
  nutrientName: string;
  nutrientUnit: UnitOption;
  dailyGoalAmount: number;
}