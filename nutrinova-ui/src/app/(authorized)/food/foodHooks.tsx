import createAuthenticatedAxiosInstanceFactory from "@/services/axiosRequestFactory";
import { NutrientOption } from "./_models/nutrientOption";
import { useQuery } from "@tanstack/react-query";


// const apiClient = await createAuthenticatedAxiosInstanceFactory({ additionalHeaders : {}, origin : 'client' });
const nutrientKeys = {
    all: ["nutrients"] as const,
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
