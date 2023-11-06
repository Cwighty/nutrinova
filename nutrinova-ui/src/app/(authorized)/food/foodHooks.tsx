import createAuthenticatedAxiosInstanceFactory from "@/services/axiosRequestFactory";
import { NutrientOption } from "./_models/nutrientOption";
import { useQuery } from "@tanstack/react-query";
import { UnitOption } from "./_models/unitOption";


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
