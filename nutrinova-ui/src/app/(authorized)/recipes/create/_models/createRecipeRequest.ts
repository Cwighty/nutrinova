interface CreateRecipeRequest {
  description?: string;
  notes?: string;
  tags?: string[];
  recipeFoods: CreateRecipeFoodRequest[];
}