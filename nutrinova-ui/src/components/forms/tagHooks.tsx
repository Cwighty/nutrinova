import createAuthenticatedAxiosInstanceFactory from "@/services/axiosRequestFactory";
import { useQuery } from "@tanstack/react-query";

export const recipetagKeys = {
  all: ["recipetags"] as const,
};

const fetchRecipeTags = async (): Promise<string[]> => {
  const apiClient = await createAuthenticatedAxiosInstanceFactory({
    additionalHeaders: {},
    origin: "client",
  });
  const response = await apiClient.get("/recipe/tags");
  return response.data as string[];
};

export const useGetRecipeTagsQuery = () => {
  return useQuery({
    queryKey: recipetagKeys.all,
    queryFn: fetchRecipeTags,
  });
};