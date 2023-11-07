import createAuthenticatedAxiosInstanceFactory from "@/services/axiosRequestFactory";
import { NutrientOption } from "./_models/nutrientOption";
import { useMutation, useQuery } from "@tanstack/react-query";
import { UnitOption } from "./_models/unitOption";
import { CreateFoodRequestModel } from "./create/_models/createFoodRequest";
import toast from "react-hot-toast";

const nutrientKeys = {
  all: ["nutrients"] as const,
};

const unitKeys = {
  all: ["units"] as const,
};

const fetchNutrients = async (): Promise<NutrientOption[]> => {
  const apiClient = await createAuthenticatedAxiosInstanceFactory({ additionalHeaders: {}, origin: 'client' });
  const response = await apiClient.get("/nutrient/all-nutrients");
  return response.data as NutrientOption[];
};

export const useGetNutrientsQuery = () => {
  return useQuery({
    queryKey: nutrientKeys.all,
    queryFn: fetchNutrients
  });
}

const fetchUnits = async (): Promise<UnitOption[]> => {
  const apiClient = await createAuthenticatedAxiosInstanceFactory({ additionalHeaders: {}, origin: 'client' });
  const response = await apiClient.get("/unit/all-units");
  return response.data as UnitOption[];
};

export const useGetUnitsQuery = () => {
  return useQuery({
    queryKey: unitKeys.all,
    queryFn: fetchUnits
  });
}

const createFood = async (food: CreateFoodRequestModel): Promise<boolean> => {
  const apiClient = await createAuthenticatedAxiosInstanceFactory({ additionalHeaders: {}, origin: 'client' });
  const response = await apiClient.post("/food", food);
  return response.status === 200;
}

export const useCreateFoodMutation = () => {
  return useMutation(
    {
      mutationFn: (food: CreateFoodRequestModel) => createFood(food),
      onSuccess: () => {
        toast.success('Food created successfully');
        //TODO: invalidate get foods query
      },
      onError: (error) => {
        toast.error("Error creating food: " + error.message);
        console.error(error);
      }
    }
  );
}
