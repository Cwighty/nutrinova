import { CreateRecipeFoodModel } from "./createRecipeFoodModel";

export interface CreateRecipeRequestModel {
  description?: string;
  tags?: string[];
  notes?: string;
  recipeFoods: CreateRecipeFoodModel[];
}