import { UnitOption } from "@/app/(authorized)/food/_models/unitOption";

export interface Recipe {
  id: string;
  description: string;
  tags: string;
  notes: string;
  amount: number;
  servingsSizeUnit: number;
  unit: UnitOption;
  recipeFoods: Food[];
}

export interface Food {
  id: string;
  description: string;
  tags: string[];
  notes: string;
  servingSize: number;
  servingSizeUnit: string;
  unitId: number;
  unitName: string;
  unit?: UnitOption;
}
