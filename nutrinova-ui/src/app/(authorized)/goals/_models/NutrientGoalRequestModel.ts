export interface NutrientGoalRequestModel {
  patientId: string;
  nutrientId: number;
  dailyUpperLimit?: number;
  dailyLowerLimit?: number;
  useRecommended: boolean;
}
