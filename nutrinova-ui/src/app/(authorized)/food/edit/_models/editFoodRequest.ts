import { SelectNutrientWithUnitState } from "@/app/(authorized)/recipes/create/_components/ServingSizeUnitField";
import { UnitOption } from "../../_models/unitOption";
import { EditFoodNutrientRequestModel } from "./editFoodNutrientRequest";

export interface EditFoodRequestModel extends SelectNutrientWithUnitState {
  description?: string;
  servingSize?: number;
  brand?: string;
  servingSizeUnit?: UnitOption | null;
  ingredients?: string[];
  servingSizeUnitId?: number;
  note?: string;
  foodNutrients: EditFoodNutrientRequestModel[] | undefined;
}