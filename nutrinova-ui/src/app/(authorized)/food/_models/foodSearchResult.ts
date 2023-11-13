export interface FoodSearchResult {
  fdcId: number;
  id: string;
  description: string;
  ingredients: string;
  brandName: string;
  servingSize: number;
  servingSizeUnit: string;
  servingSizeWithUnits: string;
  foodNutrients: FoodSearchResultNutrient[];
}

export interface FoodSearchResultNutrient {
  nutrientName: string;
  nameWithAmountAndUnit: string;
  unitName: string;
  value: number;
}
