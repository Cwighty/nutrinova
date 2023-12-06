import { Food, Recipe } from "@/app/(authorized)/recipes/create/_models/recipe";

export interface Meal {
  id: string;
  recordedBy: string;
  patientId: string;
  recordedAt: Date;
  notes: string;
  foodHistoryResponses: Food[];
  recipeHistoryResponses: Recipe[];
}
