import { CreateFoodNutrientRequestModel } from "./createFoodNutrientRequestModel";

export interface CreateFoodRequestModel {
  description?: string;
  servingSize?: number;
  unit?: number;
  note?: string;
  foodNutrients: CreateFoodNutrientRequestModel[];
}