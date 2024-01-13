import createAuthenticatedAxiosInstanceFactory from "@/services/axiosRequestFactory";
import toast from "react-hot-toast";
import { FoodConversionSample } from "./create/_models/createRecipeFoodModel";
import { useMutation } from "@tanstack/react-query";

const foodConversionSampleKeys = {
  all: "foodConversionSamples",
  sampleID: (sampleId: string) => [foodConversionSampleKeys.all, sampleId],
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
  return useMutation({
    mutationFn: createFoodConversionSample,
    onSuccess: () => {
      toast.success("Food Conversion Sample created successfully");
      // TODO: Invalidate relevant queries if needed
    },
    onError: (error) => {
      toast.error("Error creating Food Conversion Sample: " + error.message);
      console.error(error);
    },
  });
};