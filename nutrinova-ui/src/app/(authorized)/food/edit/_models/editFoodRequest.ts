import { EditFoodNutrientRequestModel } from "./editFoodNutrientRequest";

export interface EditFoodRequestModel {
  description?: string;
  servingSize?: number;
  brand?: string;
  ingredients?: string;
  unit?: number;
  note?: string;
  foodNutrients: EditFoodNutrientRequestModel[];
}