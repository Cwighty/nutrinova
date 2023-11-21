import { CreateFoodNutrientRequestModel } from "../../create/_models/createFoodNutrientRequestModel";

export interface EditFoodNutrientRequestModel extends CreateFoodNutrientRequestModel {
  nutrientId: number;
  amount: number;
  nutrientName: string;
  unitId: number;
  unitCategoryId: number;
}