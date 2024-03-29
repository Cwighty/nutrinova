import createAuthenticatedAxiosInstanceFactory from "@/services/axiosRequestFactory";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { CreateRecipeRequestModel } from "./create/_models/createRecipeRequest";
import { recipetagKeys } from "@/components/forms/tagHooks";
import { RecipeNutrientSummary } from "./create/_models/recipeNutrientSummary";
import { CreateRecipeFoodModel } from "./create/_models/createRecipeFoodModel";
import { Recipe } from "@/app/(authorized)/recipes/create/_models/recipe";
import { EditRecipeRequestModel } from "./edit/_models/EditRecipeRequestModel";
import { UnitOption } from "../food/_models/unitOption";

export const recipeKeys = {
  all: "recipes",
  summaries: "recipeSummaries",
  recipeID: (recipeId: string) => [recipeKeys.all, recipeId],
};

const createRecipe = async (
  recipe: CreateRecipeRequestModel,
): Promise<boolean> => {
  const apiClient = await createAuthenticatedAxiosInstanceFactory({
    additionalHeaders: {},
    origin: "client",
  });
  const response = await apiClient.post("/recipe", recipe);
  return response.status === 200;
};

export const useCreateRecipeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (recipe: CreateRecipeRequestModel) => createRecipe(recipe),
    onSuccess: async () => {
      //TODO: invalidate get recipe query
      await queryClient.invalidateQueries({ queryKey: recipetagKeys.all });
    },
    onError: (error) => {
      toast.error("Error creating recipe: " + error.message);
      console.error(error);
    },
  });
};

const getRecipeNutrientSummary = async (
  recipeFoods: CreateRecipeFoodModel[],
): Promise<RecipeNutrientSummary[]> => {
  const apiClient = await createAuthenticatedAxiosInstanceFactory({
    additionalHeaders: {},
    origin: "client",
  });
  if (recipeFoods.length === 0) {
    return [];
  }
  const response = await apiClient.post<RecipeNutrientSummary[]>(
    "/recipe/summarize",
    recipeFoods,
  );
  return response.data;
};

export const useRecipeSummaryQuery = (recipeFoods: CreateRecipeFoodModel[]) => {
  return useQuery({
    queryKey: [recipeKeys.summaries, recipeFoods],
    queryFn: () => getRecipeNutrientSummary(recipeFoods),
  });
};

const getAllRecipes = async (): Promise<Recipe[]> => {
  const apiClient = await createAuthenticatedAxiosInstanceFactory({
    additionalHeaders: {},
    origin: "client",
  });
  const response = await apiClient.get("/recipe");
  return response.data as Recipe[];
};

export const useGetAllRecipesQuery = () => {
  return useQuery({
    queryKey: [recipeKeys.all],
    queryFn: () => getAllRecipes(),
  });
};

const getRecipeById = async (recipeId: string): Promise<Recipe> => {
  const apiClient = await createAuthenticatedAxiosInstanceFactory({
    additionalHeaders: {},
    origin: "client",
  });
  const response = await apiClient.get(`/recipe/${recipeId}`);
  const recipe = {
    ...response.data,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    unit: response.data?.unit as UnitOption,
  } as Recipe;
  return recipe;
};

const updateRecipe = async (recipe: EditRecipeRequestModel): Promise<boolean> => {
  const apiClient = await createAuthenticatedAxiosInstanceFactory({
    additionalHeaders: {},
    origin: "client",
  });
  const recipeRes = {
    ...recipe,
    servingsUnit: {
      ...recipe.servingsUnit,
      categoryName: recipe.servingsUnit?.category?.description,
    }

  } as EditRecipeRequestModel;
  const response = await apiClient.put(`/recipe`, recipeRes);
  return response.status === 200;
}

export const useGetRecipeByIdQuery = (recipeId: string) => {
  return useQuery({
    queryKey: recipeKeys.recipeID(recipeId),
    queryFn: () => getRecipeById(recipeId),
  });
};

export const useEditRecipeMutation = (recipeID: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (recipe: EditRecipeRequestModel) => updateRecipe(recipe),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: recipeKeys.recipeID(recipeID) });
    }
  })
}
