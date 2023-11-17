import { CreateRecipeRequestModel } from "@/app/(authorized)/recipes/create/_models/createRecipeRequest";
import { UnitOption } from "../../_models/unitOption";
import { EditFoodNutrientRequestModel } from "./editFoodNutrientRequest";

export interface EditFoodRequestModel extends CreateRecipeRequestModel {
  description?: string;
  servingSize?: number;
  brand?: string;
  servingSizeUnit?: UnitOption | null;
  ingredients?: string[];
  servingSizeUnitId?: number;
  note?: string;
  foodNutrients: EditFoodNutrientRequestModel[];
}