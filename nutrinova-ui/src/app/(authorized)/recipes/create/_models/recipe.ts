import { UnitOption } from "@/app/(authorized)/food/_models/unitOption";

export interface Recipe {
  id: string;
  description: string;
  tags: string;
  notes: string;
  amount: number;
  servingsSizeUnitId: number;
  unit: UnitOption;
  recipeFoods: RecipeFood[];
}

export interface RecipeFood {
  foodId: string;
  name: string;
  amount: number;
  unitId: number;
  unitName: string;
  food: Food;
}

export interface Food {
  id: string;
  description: string;
  tags: string[];
  notes: string;
}
