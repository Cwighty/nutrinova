import { UnitOption } from "@/app/(authorized)/food/_models/unitOption";

export interface RecipeNutrientSummary {
  name: string;
  amount: number;
  unit: UnitOption;
}
