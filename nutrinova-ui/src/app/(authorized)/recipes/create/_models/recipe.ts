import { UnitOption } from "@/app/(authorized)/food/_models/unitOption";
import { RecipeNutrientSummary } from "./recipeNutrientSummary";

export interface Recipe {
  id: string;
  description: string;
  tags: string;
  notes: string;
  amount: number;
  servingsSizeUnit: number;
  unit: UnitOption;
  recipeFoods: Food[];
  nutrientSummaries: RecipeNutrientSummary[];
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
