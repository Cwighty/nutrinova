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
}

export interface FoodSearchResultNutrient {
  nutrientName: string;
  nameWithAmountAndUnit: string;
  unitName: string;
  value: number;
}
