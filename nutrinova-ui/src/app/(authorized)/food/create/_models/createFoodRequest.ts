import { CreateFoodNutrientRequestModel } from "./createFoodNutrientRequestModel";

export interface CreateFoodRequestModel {
    description?: string;
    servingSize?: number;
    unit?: string;
    note?: string;
    foodNutrients: CreateFoodNutrientRequestModel[];
}