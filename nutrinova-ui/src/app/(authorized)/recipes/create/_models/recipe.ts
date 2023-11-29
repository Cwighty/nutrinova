import { UnitOption } from "@/app/(authorized)/food/_models/unitOption";

export interface Recipe {
  id: string;
  description: string;
  tags: string;
  notes: string;
  amount: number;
  servingsSizeUnit: number;
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
  unit: UnitOption;
}

export interface Food {
  id: string;
  description: string;
  tags: string[];
  notes: string;
}
