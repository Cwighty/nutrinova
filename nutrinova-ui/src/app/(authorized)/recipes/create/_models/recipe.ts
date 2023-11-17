export interface Recipe {
  id: string;
  description: string;
  tags: string;
  notes: string;
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
