import { UnitOption } from "@/app/(authorized)/food/_models/unitOption";

export interface PrepMealItem {
  id: string;
  fdcid?: number | null;
  description: string;
  servingSize: number;
  servingSizeUnit?: UnitOption;
  calories: number;
  type: string;
}