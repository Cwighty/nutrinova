import createAuthenticatedAxiosInstanceFactory from "@/services/axiosRequestFactory";
import { NutrientOption } from "./_models/nutrientOption";
import { useQuery } from "@tanstack/react-query";
import { FoodSearchResult } from "@/app/(authorized)/food/_models/foodSearchResult";

// const apiClient = await createAuthenticatedAxiosInstanceFactory({ additionalHeaders : {}, origin : 'client' });
const nutrientKeys = {
  all: ["nutrients"] as const,
  foods: ["foods"] as const,
};

const fetchNutrients = async (): Promise<NutrientOption[]> => {
  const apiClient = await createAuthenticatedAxiosInstanceFactory({
    additionalHeaders: {},
    origin: "client",
  });
  const response = await apiClient.get("/nutrient/all-nutrients");
  return response.data as NutrientOption[];
};

const fetchFoodsForUser = async (): Promise<FoodSearchResult[]> => {
  const apiClient = await createAuthenticatedAxiosInstanceFactory({
    additionalHeaders: {},
    origin: "client",
  });
  const response = await apiClient.get("/food/all-foods");
  return response.data as FoodSearchResult[];
};

export const useGetNutrientsQuery = () => {
  return useQuery({
    queryKey: nutrientKeys.all,
    queryFn: fetchNutrients,
  });
};

export const useGetAllFoodForUserQuery = () => {
  return useQuery({
    queryKey: nutrientKeys.foods,
    queryFn: fetchFoodsForUser,
  });
};
