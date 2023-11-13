import createAuthenticatedAxiosInstanceFactory from "@/services/axiosRequestFactory";
import { NutrientOption } from "./_models/nutrientOption";
import { FoodSearchResult } from "@/app/(authorized)/food/_models/foodSearchResult";
import { useMutation, useQuery } from "@tanstack/react-query";
import { UnitOption } from "./_models/unitOption";
import { CreateFoodRequestModel } from "./create/_models/createFoodRequest";
import toast from "react-hot-toast";
import { searchParameters } from "./view/page";

const nutrientKeys = {
  all: ["nutrients"] as const,
};

const unitKeys = {
  all: ["units"] as const,
};

const foodKeys = {
  all: ["foods"] as const,
  foodSearchParams: (foodName: string, nutrient: string, comparisonOperator: string, nutrientValue: number) => [...foodKeys.all, foodName, nutrient, nutrientValue, comparisonOperator] as const,
};

const fetchNutrients = async (): Promise<NutrientOption[]> => {
  const apiClient = await createAuthenticatedAxiosInstanceFactory({
    additionalHeaders: {},
    origin: "client",
  });
  const response = await apiClient.get("/nutrient/all-nutrients");
  return response.data as NutrientOption[];
};

const fetchFoodsForUser = async (
  foodSearchParameters: searchParameters,
): Promise<FoodSearchResult[]> => {
  const apiClient = await createAuthenticatedAxiosInstanceFactory({
    additionalHeaders: {},
    origin: "client",
  });

  const response = await apiClient.get(
    `/food/all-foods?filterOption=${foodSearchParameters.foodSearchTerm}
    &nutrientFilterValue=${foodSearchParameters?.nutrientValue ?? 0}
    &nutrientFilterOperator=${foodSearchParameters?.comparisonOperator ?? ""}
    &nutrientFilter=${foodSearchParameters?.nutrientSearchTerm?.nutrientName ?? ""}
    `
  );
  return response.data as FoodSearchResult[];
};

export const useGetNutrientsQuery = () => {
  return useQuery({
    queryKey: nutrientKeys.all,
    queryFn: fetchNutrients,
  });
};

export const useGetAllFoodForUserQuery = (foodSearchParameters: searchParameters) => {
  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: foodKeys.foodSearchParams(
      foodSearchParameters.foodSearchTerm,
      foodSearchParameters.nutrientSearchTerm.nutrientName,
      foodSearchParameters?.comparisonOperator ?? "",
      foodSearchParameters?.nutrientValue ?? 0),
    queryFn: () => fetchFoodsForUser(foodSearchParameters),
  });
};

const fetchUnits = async (): Promise<UnitOption[]> => {
  const apiClient = await createAuthenticatedAxiosInstanceFactory({
    additionalHeaders: {},
    origin: "client",
  });
  const response = await apiClient.get("/unit/all-units");
  return response.data as UnitOption[];
};

export const useGetUnitsQuery = () => {
  return useQuery({
    queryKey: unitKeys.all,
    queryFn: fetchUnits,
  });
};

const createFood = async (food: CreateFoodRequestModel): Promise<boolean> => {
  const apiClient = await createAuthenticatedAxiosInstanceFactory({
    additionalHeaders: {},
    origin: "client",
  });
  const response = await apiClient.post("/food", food);
  return response.status === 200;
};

export const useCreateFoodMutation = () => {
  return useMutation({
    mutationFn: (food: CreateFoodRequestModel) => createFood(food),
    onSuccess: () => {
      toast.success("Food created successfully");
      //TODO: invalidate get foods query
    },
    onError: (error) => {
      toast.error("Error creating food: " + error.message);
      console.error(error);
    },
  });
};

export interface ImportFoodResponse {
  id: number;
}

const importFood = async (fdcId: number): Promise<ImportFoodResponse> => {
  const apiClient = await createAuthenticatedAxiosInstanceFactory({
    additionalHeaders: {},
    origin: "client",
  });
  const response = await apiClient.post<ImportFoodResponse>(`/food/import/${fdcId}`);
  return response.data
}

export const useImportFoodMutation = () => {
  return useMutation({
    mutationFn: (fdcId: number) => importFood(fdcId),
    onSuccess: () => {
      toast.success("Food imported successfully");
    },
    onError: (error) => {
      toast.error("Error importing food: " + error.message);
      console.error(error);
    },
  });
}

export const useGetFoodByIdQuery = (foodId: string) => {
  return useQuery({
    queryKey: foodKeys.foodName(foodId),
    queryFn: () => fetchFoodsForUser(foodId),
  });
}
