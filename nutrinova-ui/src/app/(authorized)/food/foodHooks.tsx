import createAuthenticatedAxiosInstanceFactory from "@/services/axiosRequestFactory";
import { NutrientOption } from "./_models/nutrientOption";
import { FoodSearchResult } from "@/app/(authorized)/food/_models/foodSearchResult";
import { useMutation, useQuery } from "@tanstack/react-query";
import { UnitOption } from "./_models/unitOption";
import { CreateFoodRequestModel } from "./create/_models/createFoodRequest";
import toast from "react-hot-toast";
import { FoodSearchFilterParams } from "./_models/foodSearchFilterParams";

const nutrientKeys = {
  all: ["nutrients"] as const,
};

const unitKeys = {
  all: ["units"] as const,
};

const foodKeys = {
  all: ["foods"] as const,
  foodName: (foodName: string) => [...foodKeys.all, foodName] as const,
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
  foodName: string,
): Promise<FoodSearchResult[]> => {
  const apiClient = await createAuthenticatedAxiosInstanceFactory({
    additionalHeaders: {},
    origin: "client",
  });
  const response = await apiClient.get(
    "/food/all-foods?filterOption=" + foodName,
  );
  return response.data as FoodSearchResult[];
};

export const useGetNutrientsQuery = () => {
  return useQuery({
    queryKey: nutrientKeys.all,
    queryFn: fetchNutrients,
  });
};

export const useGetAllFoodForUserQuery = (foodName: string) => {
  return useQuery({
    queryKey: foodKeys.foodName(foodName),
    queryFn: () => fetchFoodsForUser(foodName),
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


const foodSearchKeys = {
  all: ["foodSearchResults"] as const,
  foodSearchResult: (fdcId: number) => [...foodSearchKeys.all, fdcId] as const,
};

const fetchFoodSearchResults = async (filterParams: FoodSearchFilterParams) => {
  const query = new URLSearchParams();
  query.set("foodName", filterParams.foodName);
  query.set("filterOption", filterParams.filterOption);

  const foodSearchInstance = await createAuthenticatedAxiosInstanceFactory({
    additionalHeaders: {},
    origin: "client",
  });
  if (filterParams.foodName.trim() === "") {
    return [];
  }
  const response = await foodSearchInstance.get<FoodSearchResult[]>(
    "food/search?" + query.toString(),
  );
  return response.data;
}

export const useGetFoodSearchResultsQuery = (filterParams: FoodSearchFilterParams) => {
  return useQuery({
    queryKey: [foodSearchKeys.all, filterParams],
    queryFn: () => fetchFoodSearchResults(filterParams),
  });
}


const getFoodSearchResult = (foodId: number, foods: FoodSearchResult[]) => {
  return foods.find((food) => food.fdcId === foodId);
}

export const useGetFoodSearchResultQuery = (foodSearchFilterParams: FoodSearchFilterParams, fdcId: number) => {
  const { data: foods, isSuccess } = useGetFoodSearchResultsQuery(foodSearchFilterParams);

  return useQuery({
    queryKey: [foodSearchKeys.foodSearchResult(fdcId), foods],
    queryFn: () => getFoodSearchResult(fdcId, foods!),
    enabled: isSuccess && foods !== undefined,
  });
};

