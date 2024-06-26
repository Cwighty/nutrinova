import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import createAuthenticatedAxiosInstanceFactory from "@/services/axiosRequestFactory";
import { MealSelectionItem } from "./record/_models/mealSelectionItem";
import { RecordMealRequest } from "./record/_models/recordMealRequest";
import { Meal, UpdateMeal } from "@/app/(authorized)/meals/view/_models/viewMeal";

export const mealKeys = {
  all: "meals",
  search: "searchMeals",
  details: "mealDetails",
};

const searchMealItems = async (query: string): Promise<MealSelectionItem[]> => {
  const apiClient = await createAuthenticatedAxiosInstanceFactory({
    additionalHeaders: {},
    origin: "client",
  });
  const response = await apiClient.get<MealSelectionItem[]>(
    `/meal/searchFoodItems?query=${query}`,
  );
  return response.data;
};

export const useSearchMealItemsQuery = (query: string) => {
  return useQuery({
    queryKey: [mealKeys.search, query],
    queryFn: () => searchMealItems(query),
  });
};

const addMeal = async (recordMealRequest: RecordMealRequest): Promise<void> => {
  const apiClient = await createAuthenticatedAxiosInstanceFactory({
    additionalHeaders: {},
    origin: "client",
  });
  await apiClient.post("/meal", recordMealRequest);
};

export const useAddMealMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addMeal,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [mealKeys.all] });
    },
    onError: (error: Error) => {
      toast.error(`Error recording meal: ${error.message}`);
      console.error(error);
    },
  });
};

const getMealHistory = async (
  beginDate: Date,
  endDate: Date,
): Promise<Meal[]> => {
  const apiClient = await createAuthenticatedAxiosInstanceFactory({
    additionalHeaders: {},
    origin: "client",
  });
  const response = await apiClient.get<Meal[]>("/Meal/getMealHistory", {
    params: { beginDate, endDate },
  });
  return response.data;
};

export const useGetMealHistoryQuery = (startTime: Date, endTime: Date) => {
  return useQuery({
    queryKey: [mealKeys.all, startTime, endTime],
    queryFn: () => getMealHistory(startTime, endTime),
  });
};

export const useGetTodaysMealsQuery = () => {
  const todaysDate = new Date();
  const today = new Date(todaysDate.setHours(0, 0, 0, 0));
  const endOfDay = new Date(todaysDate.setHours(23, 59, 59, 999));

  return useQuery({
      queryKey: [mealKeys.all, today, endOfDay],
      queryFn: () => getMealHistory(today, endOfDay),
    });
};


export const useGetAllRecentMealsQuery = () => {
  const monthAgo = new Date(new Date().setMonth(new Date().getMonth() - 1));
  const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1));

  // trim off the time part of the date so they don't invalidate the query
  monthAgo.setHours(0, 0, 0, 0);
  tomorrow.setHours(0, 0, 0, 0);

  return useQuery({
    queryKey: [mealKeys.all, monthAgo, tomorrow],
    queryFn: () => getMealHistory(monthAgo, tomorrow),
  });
}

const getMealDetails = async (mealId: string): Promise<Meal> => {
  const apiClient = await createAuthenticatedAxiosInstanceFactory({
    additionalHeaders: {},
    origin: "client",
  });
  const response = await apiClient.get<Meal>(`/Meal/${mealId}`);
  return response.data;
};

export const useGetMealDetailsQuery = (mealId: string) => {
  return useQuery({
    queryKey: [mealKeys.details, mealId],
    queryFn: () => getMealDetails(mealId),
  });
};

const updateMeal = async (meal: UpdateMeal): Promise<void> => {
  const apiClient = await createAuthenticatedAxiosInstanceFactory({
    additionalHeaders: {},
    origin: "client",
  });
  await apiClient.put(`/Meal`, meal);
};

export const useUpdateMealMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMeal,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [mealKeys.all] });
      toast.success("Meal updated successfully");
    },
    onError: (error: Error) => {
      toast.error(`Error updating meal: ${error.message}`);
      console.error(error);
    },
  });
}

const deleteMeal = async (mealId: string): Promise<void> => {
  const apiClient = await createAuthenticatedAxiosInstanceFactory({
    additionalHeaders: {},
    origin: "client",
  });
  await apiClient.delete(`/Meal/${mealId}`);
}

export const useDeleteMealMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMeal,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [mealKeys.all] });
    },
    onError: (error: Error) => {
      toast.error(`Error deleting meal: ${error.message}`);
      console.error(error);
    },
  });
}
