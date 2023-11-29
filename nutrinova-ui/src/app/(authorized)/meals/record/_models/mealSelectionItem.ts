import { UnitOption } from "@/app/(authorized)/food/_models/unitOption";

export interface MealSelectionItem {
  id: string;
  fdcid?: number | null;
  description: string;
  servingSize: number;
  servingSizeUnit?: UnitOption | null;
  note?: string | null;
  type: string;
}
