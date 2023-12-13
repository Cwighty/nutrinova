import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import createAuthenticatedAxiosInstanceFactory from "@/services/axiosRequestFactory";
import { useNotification } from "@/components/providers/NotificationProvider";
import { MealSelectionItem } from "./record/_models/mealSelectionItem";
import { RecordMealRequest } from "./record/_models/recordMealRequest";
import { Meal } from "@/app/(authorized)/meals/view/_models/viewMeal";

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
  recordMealRequest.recordedAt = new Date(recordMealRequest.recordedAt.setDate(recordMealRequest.recordedAt.getDate() - 1));
  await apiClient.post("/meal", recordMealRequest);
};

export const useAddMealMutation = () => {
  const queryClient = useQueryClient();
  const notificationContext = useNotification();

  return useMutation({
    mutationFn: addMeal,
    onSuccess: async () => {
      notificationContext.sendMessage("Meal recorded successfully");
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
