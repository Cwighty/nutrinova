import { UnitOption } from "@/app/(authorized)/food/_models/unitOption";

export interface EditRecipeRequestModel {
  id: string;
  description?: string;
  tags?: string[];
  notes?: string;
  recipeFoods: EditRecipeFoodRequestModel[];
  amount?: number;
  note?: string;
  servingsUnit?: UnitOption | null;
  unitId?: number;
  categoryId: number;
}

export interface EditRecipeFoodRequestModel {
  id: string;
  name: string;
  servingSize: number;
  unitId: number;
  unitName: string;
  unit?: UnitOption;
  servingSizeUnitName?: string;
}