import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import createAuthenticatedAxiosInstanceFactory from '@/services/axiosRequestFactory';
import { useNotification } from '@/components/providers/NotificationProvider';
import { MealSelectionItem } from './record/_models/mealSelectionItem';
import { RecordMealRequest } from './record/_models/recordMealRequest';

export const mealKeys = {
  all: 'meals',
  search: 'searchMeals',
  details: 'mealDetails',
};


// interface MealHistory {
//   // Define properties based on your MealHistory entity
// }

// Define other interfaces as needed for your meal operations

// Function to search for meal items
const searchMealItems = async (query: string): Promise<MealSelectionItem[]> => {
  const apiClient = await createAuthenticatedAxiosInstanceFactory({
    additionalHeaders: {},
    origin: 'client',
  });
  const response = await apiClient.get<MealSelectionItem[]>(`/meal/searchFoodItems?query=${query}`);
  return response.data;
};

export const useSearchMealItemsQuery = (query: string) => {
  return useQuery({
    queryKey: [mealKeys.search, query],
    queryFn: () => searchMealItems(query),
    enabled: query.length > 0,
  });
};

// // Function to get meal details by ID
// const getMealById = async (id: string): Promise<MealHistory> => {
//   const apiClient = await createAuthenticatedAxiosInstanceFactory({
//     additionalHeaders: {},
//     origin: 'client',
//   });
//   const response = await apiClient.get(`/meal/${id}`);
//   return response.data;
// };

// export const useGetMealByIdQuery = (id: string) => {
//   return useQuery({
//     queryKey: [mealKeys.details, id],
//     queryFn: () => getMealById(id),
//   });
// };

// Function to add a meal
const addMeal = async (recordMealRequest: RecordMealRequest): Promise<void> => {
  const apiClient = await createAuthenticatedAxiosInstanceFactory({
    additionalHeaders: {},
    origin: 'client',
  });
  await apiClient.post('/meal', recordMealRequest);
};

export const useAddMealMutation = () => {
  const queryClient = useQueryClient();
  const notificationContext = useNotification();

  return useMutation({
    mutationFn: addMeal,
    onSuccess: async () => {
      notificationContext.sendMessage('Meal recorded successfully');
      await queryClient.invalidateQueries({ queryKey: [mealKeys.all] });
    },
    onError: (error: Error) => {
      toast.error(`Error recording meal: ${error.message}`);
      console.error(error);
    },
  });
};