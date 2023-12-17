import { UnitOption } from "./unitOption";

export interface FoodSearchResult {
  fdcId: number;
  id: string;
  description: string;
  ingredients: string;
  brandName: string;
  servingSize: number;
  servingSizeUnit: string;
  servingSizeUnitCategory?: string;
  servingSizeWithUnits: string;
  foodNutrients: FoodSearchResultNutrient[];
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
  foodNutrients: FoodSearchResultNutrient[];
  unit: UnitOption;
  note: string;
  unitCategoryId: number;
}

export interface FoodSearchResultNutrient {
  nutrientName: string;
  nameWithAmountAndUnit: string;
  unitName: string;
  value: number;
  nutrientId: number;
  unitId: number;
  categoryId: number;
}
