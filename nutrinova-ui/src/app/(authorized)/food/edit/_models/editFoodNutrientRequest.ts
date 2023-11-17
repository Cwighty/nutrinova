import { CreateFoodNutrientRequestModel } from "../../create/_models/createFoodNutrientRequestModel";

export interface EditFoodNutrientRequestModel extends CreateFoodNutrientRequestModel {
  nutrientId: number;
  amount: number;
  unitId: number;
}