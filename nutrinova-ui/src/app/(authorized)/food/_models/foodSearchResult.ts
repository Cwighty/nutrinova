import { UnitOption } from "./unitOption";

export interface FlattenedFood {
  fdcId: number;
  id: string;
  description: string;
  ingredients: string;
  brandName: string;
  createdAt: Date;
  servingSize: number;
  servingSizeUnit: string;
  servingSizeUnitOption: UnitOption;
  servingSizeUnitCategory?: string;
  servingSizeWithUnits: string;
  imported: boolean;
  foodNutrients: FlattenedFoodNutrient[];
  note: string;
  unitCategoryId: number;
}

export interface FoodResponse {
  fdcId: number;
  id: string;
  description: string;
  ingredients: string;
  brandName: string;
  servingSize: number;
  servingSizeUnit: string;
  servingSizeUnitCategory?: string;
  servingSizeWithUnits: string;
  foodNutrients: FlattenedFoodNutrient[];
  unit: UnitOption;
  note: string;
  unitCategoryId: number;
}

export interface FlattenedFoodNutrient {
  nutrientName: string;
  nameWithAmountAndUnit: string;
  unitName: string;
  value: number;
  nutrientId: number;
  unitId: number;
  categoryId: number;
}
