import createAuthenticatedAxiosInstanceFactory from "@/services/axiosRequestFactory";
import toast from "react-hot-toast";
import { FoodConversionSample, GetMatchingFoodConversionSampleRequest } from "./create/_models/createRecipeFoodModel";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const foodConversionSampleKeys = {
  matching: "matchingFoodConversionSample",
};

// Create a new food conversion sample
const createFoodConversionSample = async (sample: FoodConversionSample): Promise<boolean> => {
  const apiClient = await createAuthenticatedAxiosInstanceFactory({
    additionalHeaders: {},
    origin: "client",
  });
  const response = await apiClient.post("/conversionsample", sample);
  return response.status === 200;
};

export const useCreateFoodConversionSampleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createFoodConversionSample,
    onSuccess: async () => {
      toast.success("Food Conversion Sample created successfully");
      await queryClient.invalidateQueries({ queryKey: [foodConversionSampleKeys.matching] });
    },
    onError: (error) => {
      toast.error("Error creating Food Conversion Sample: " + error.message);
      console.error(error);
    },
  });
};

const getMatchingFoodConversionSample = async (foodPlanId: string, measurementUnitId: number): Promise<FoodConversionSample | null> => {
  const apiClient = await createAuthenticatedAxiosInstanceFactory({
    additionalHeaders: {},
    origin: "client",
  });
  const request: GetMatchingFoodConversionSampleRequest = {
    foodPlanId: foodPlanId,
    measurementUnitId: measurementUnitId,
  }
  const response = await apiClient.post("/conversionsample/matching", request);
  return response.status === 200 ? response.data as FoodConversionSample : null;
}

export const useGetMatchingFoodConversionSampleQuery = (foodPlanId: string, measurementUnitId: number) => {
  return useQuery({
    queryKey: [foodConversionSampleKeys.matching, foodPlanId, measurementUnitId],
    queryFn: () => getMatchingFoodConversionSample(foodPlanId, measurementUnitId),
  });
}