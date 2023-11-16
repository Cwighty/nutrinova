import createAuthenticatedAxiosInstanceFactory from "@/services/axiosRequestFactory";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { CreateRecipeRequestModel } from "./create/_models/createRecipeRequest";
import { recipetagKeys } from "@/components/forms/tagHooks";
import { RecipeNutrientSummary } from "./create/_models/recipeNutrientSummary";
import { CreateRecipeFoodModel } from "./create/_models/createRecipeFoodModel";

export const recipeKeys = {
  all: "recipes",
  summaries: "recipeSummaries",
};

const createRecipe = async (recipe: CreateRecipeRequestModel): Promise<boolean> => {
  const apiClient = await createAuthenticatedAxiosInstanceFactory({
    additionalHeaders: {},
    origin: "client",
  });
  const response = await apiClient.post("/recipe", recipe);
  return response.status === 200;
};

export const useCreateRecipeMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (recipe: CreateRecipeRequestModel) => createRecipe(recipe),
    onSuccess: async () => {
      toast.success("Recipe created successfully");
      //TODO: invalidate get recipe query
      await queryClient.invalidateQueries({ queryKey: recipetagKeys.all });
    },
    onError: (error) => {
      toast.error("Error creating recipe: " + error.message);
      console.error(error);
    },
  });
};

const getRecipeNutrientSummary = async (recipeFoods: CreateRecipeFoodModel[]): Promise<RecipeNutrientSummary[]> => {
  const apiClient = await createAuthenticatedAxiosInstanceFactory({
    additionalHeaders: {},
    origin: "client",
  });
  if (recipeFoods.length === 0) {
    return [];
  }
  const response = await apiClient.post<RecipeNutrientSummary[]>("/recipe/summarize", recipeFoods);
  return response.data;
}

export const useRecipeSummaryQuery = (recipeFoods: CreateRecipeFoodModel[]) => {
  return useQuery({
    queryKey: [recipeKeys.summaries, recipeFoods],
    queryFn: () => getRecipeNutrientSummary(recipeFoods),
  });
}