import { UnitOption } from "@/app/(authorized)/food/_models/unitOption";
import { CreateRecipeFoodModel } from "./createRecipeFoodModel";
import { SelectNutrientWithUnitState } from "../_components/ServingSizeUnitField";

export interface CreateRecipeRequestModel extends SelectNutrientWithUnitState {
  description?: string;
  tags?: string[];
  notes?: string;
  recipeFoods: CreateRecipeFoodModel[];
  servingSize?: number;
  servingSizeUnit?: UnitOption | null;
  servingSizeUnitId?: number;
}