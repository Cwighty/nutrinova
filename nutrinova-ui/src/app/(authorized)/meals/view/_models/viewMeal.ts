import { Food, Recipe } from "@/app/(authorized)/recipes/create/_models/recipe";
import { Patient } from "@/app/(authorized)/patients/_models/patient";

export interface Meal {
  id: string;
  recordedby: string;
  patientId: string;
  recordedAt: Date;
  notes: string;
  foodHistoryResponses: Food[];
  recipeHistoryResponses: Recipe[];
  patientResponse: Patient;
}
