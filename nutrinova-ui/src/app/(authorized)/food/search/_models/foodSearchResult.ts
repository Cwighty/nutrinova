export interface FoodSearchResult {
    fdcId: number;
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
