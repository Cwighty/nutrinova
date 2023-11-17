export interface Recipe {
  id: string;
  description: string;
  tags: string[];
  notes: string;
  recipeFoods: RecipeFood[];
  servingSize: number;
  servingSizeUnit: UnitOption;
  servingSizeWithUnits: string;
  recipeNutrients: RecipeNutrientSummary[];
}

export interface RecipeFood {
  foodId: string;
  name: string;
  amount: number;
  unitId: number;
  unitName: string;
}

export interface RecipeNutrientSummary {
  name: string;
  amount: number;
  unit: UnitOption;
}

export interface UnitOption {
  id: number;
  name: string;
  abbreviation: string;
}
