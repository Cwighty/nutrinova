import { UnitOption } from "@/app/(authorized)/food/_models/unitOption";
import { CreateRecipeFoodModel } from "./createRecipeFoodModel";

export interface CreateRecipeRequestModel{
  description?: string;
  tags?: string[];
  notes?: string;
  recipeFoods: CreateRecipeFoodModel[];
  servingSize?: number;
  servingSizeUnit?: UnitOption | null;
  servingSizeUnitId?: number;
}