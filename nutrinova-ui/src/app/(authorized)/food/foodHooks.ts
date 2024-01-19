import createAuthenticatedAxiosInstanceFactory from "@/services/axiosRequestFactory";
import { NutrientOption } from "./_models/nutrientOption";
import { FoodResponse, FoodSearchResult } from "@/app/(authorized)/food/_models/foodSearchResult";
import { useMutation, useQuery } from "@tanstack/react-query";
import { UnitCategory, UnitOption } from "./_models/unitOption";
import { CreateFoodRequestModel } from "./create/_models/createFoodRequest";
import toast from "react-hot-toast";
import { SearchParameters } from "./view/page";
import { FoodSearchFilterParams } from "./_models/foodSearchFilterParams";
import { EditFoodRequestModel } from "./edit/_models/editFoodRequest";
import { useContext } from "react";
import { NotificationContext } from "@/components/providers/NotificationProvider";

const nutrientKeys = {
  all: ["nutrients"] as const,
};

const unitKeys = {
  all: ["units"] as const,
};

const foodKeys = {
  all: ["foods"] as const,
  foodSearchParams: (
    foodName: string,
    nutrient: string,
    comparisonOperator: string,
    nutrientValue: number
  ) =>
    [
      ...foodKeys.all,
      foodName,
      nutrient,
      nutrientValue,
      comparisonOperator,
    ] as const,
  foodID: (foodId: string) => [...foodKeys.all, foodId] as const,
};

const fetchNutrients = async (): Promise<NutrientOption[]> => {
  const apiClient = await createAuthenticatedAxiosInstanceFactory({
    additionalHeaders: {},
    origin: "client",
  });
  const response = await apiClient.get("/nutrient/all-nutrients");
  return response.data as NutrientOption[];
};

const fetchFoodById = async (foodId: string): Promise<FoodResponse> => {
  const apiClient = await createAuthenticatedAxiosInstanceFactory({
    additionalHeaders: {},
    origin: "client",
  });
  if (foodId === "") {
    return {} as FoodResponse;
  }
  const response = await apiClient.get(`/food/food-details/${foodId}`);
  return response.data as FoodResponse;
};

const fetchFoodsForUser = async (
  foodSearchParameters: SearchParameters
): Promise<FoodSearchResult[]> => {
  const apiClient = await createAuthenticatedAxiosInstanceFactory({
    additionalHeaders: {},
    origin: "client",
  });
  const response = await apiClient.get(
    `/food/all-foods`, {
    params: {
      "filterOption": foodSearchParameters.foodSearchTerm,
      "nutrientFilterValue": foodSearchParameters?.nutrientValue ?? 0,
      "nutrientFilterOperator": foodSearchParameters?.comparisonOperator ?? "",
      "nutrientFilter": foodSearchParameters?.nutrientSearchTerm?.description ?? ""
    }
  }
  );
  return response.data as FoodSearchResult[];
};

export const useGetNutrientsQuery = () => {
  return useQuery({
    queryKey: nutrientKeys.all,
    queryFn: fetchNutrients,
  });
};

export const useGetAllFoodForUserQuery = (
  foodSearchParameters: SearchParameters
) => {
  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: foodKeys.foodSearchParams(
      foodSearchParameters.foodSearchTerm,
      foodSearchParameters.nutrientSearchTerm.description,
      foodSearchParameters?.comparisonOperator ?? "",
      foodSearchParameters?.nutrientValue ?? 0
    ),
    queryFn: () => fetchFoodsForUser(foodSearchParameters),
  });
};

const updateFood = async (food: EditFoodRequestModel): Promise<boolean> => {
  const apiClient = await createAuthenticatedAxiosInstanceFactory({
    additionalHeaders: {
    },
    origin: "client",
  });
  const outGoingRequest = {
    ...food,
    ingredients: food.ingredients?.toString(),
    Unit: {
      ...food.servingSizeUnit, unitCategoryId: food.unitCategoryId, category: {
        id: food.unitCategoryId,
        description: ""
      } as UnitCategory
    } as UnitOption,
  }
  const response = await apiClient.put("/food", outGoingRequest);
  return response.status === 200;
}

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

const createFood = async (food: CreateFoodRequestModel): Promise<CreateFoodRequestModel> => {
  const apiClient = await createAuthenticatedAxiosInstanceFactory({
    additionalHeaders: {},
    origin: "client",
  });
  await apiClient.post("/food", food);
  return food;
};

export const useCreateFoodMutation = () => {
  const notificationContext = useContext(NotificationContext);
  return useMutation({
    mutationFn: (food: CreateFoodRequestModel) => createFood(food),
    onSuccess: (food: CreateFoodRequestModel) => {
      notificationContext!.sendMessage("New Food Created: " + food.description);
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
  const response = await apiClient.post<ImportFoodResponse>(
    `/food/import/${fdcId}`
  );
  return response.data;
};

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
};

export const useGetFoodByIdQuery = (foodId: string) => {
  return useQuery({
    queryKey: foodKeys.foodID(foodId),
    queryFn: () => fetchFoodById(foodId),
  });
};

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
    "food/search?" + query.toString()
  );
  return response.data;
};

export const useGetFoodSearchResultsQuery = (
  filterParams: FoodSearchFilterParams
) => {
  return useQuery({
    queryKey: [foodSearchKeys.all, filterParams],
    queryFn: () => fetchFoodSearchResults(filterParams),
  });
};

const getFoodSearchResult = (foodId: number, foods: FoodSearchResult[]) => {
  return foods.find((food) => food.fdcId === foodId);
};

export const useGetFoodSearchResultQuery = (
  foodSearchFilterParams: FoodSearchFilterParams,
  fdcId: number
) => {
  const { data: foods, isSuccess } = useGetFoodSearchResultsQuery(
    foodSearchFilterParams
  );

  return useQuery({
    queryKey: [foodSearchKeys.foodSearchResult(fdcId), foods],
    queryFn: () => getFoodSearchResult(fdcId, foods!),
    enabled: isSuccess && foods !== undefined,
  });
};

export const useEditFoodMutation = () => {
  return useMutation({
    mutationFn: (food: EditFoodRequestModel) => updateFood(food),
    onSuccess: () => {
      toast.success("Food edited successfully");
    }
  });
}
