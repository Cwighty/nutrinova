import createAuthenticatedAxiosInstanceFactory from "@/services/axiosRequestFactory";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

const createRecipe = async (recipe: CreateRecipeRequest): Promise<boolean> => {
  const apiClient = await createAuthenticatedAxiosInstanceFactory({
    additionalHeaders: {},
    origin: "client",
  });
  const response = await apiClient.post("/food", recipe);
  return response.status === 200;
};

export const useCreateRecipeMutation = () => {
  return useMutation({
    mutationFn: (recipe: CreateRecipeRequest) => createRecipe(recipe),
    onSuccess: () => {
      toast.success("Recipe created successfully");
      //TODO: invalidate get recipe query
    },
    onError: (error) => {
      toast.error("Error creating recipe: " + error.message);
      console.error(error);
    },
  });
};

