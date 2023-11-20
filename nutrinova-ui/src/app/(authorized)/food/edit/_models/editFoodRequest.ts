import { SelectNutrientWithUnitState } from "@/app/(authorized)/recipes/create/_components/ServingSizeUnitField";
import { UnitOption } from "../../_models/unitOption";
import { EditFoodNutrientRequestModel } from "./editFoodNutrientRequest";

export interface EditFoodRequestModel extends SelectNutrientWithUnitState {
  id: string;
  description?: string;
  servingSize?: number;
  brandName?: string;
  servingSizeUnit?: UnitOption | null;
  ingredients?: string[] ;
  servingSizeUnitId?: number;
  note?: string;
  foodNutrients?: EditFoodNutrientRequestModel[];
}