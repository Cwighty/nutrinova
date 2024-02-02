import createAuthenticatedAxiosInstanceFactory from "@/services/axiosRequestFactory";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { NutrientGoalResponse } from "./_models/NutrientGoalResponse";
import { NutrientGoalRequestModel } from "./_models/NutrientGoalRequestModel";
import { PatientNutrientGoalReport } from "./_models/PatientNutrientGoalReport";

const goalKeys = {
  all: ['goals'] as const,
  reports: (dates: { beginDate: Date; endDate: Date }) => [dates, 'goalReports'] as const,
};

const fetchAllGoals = async (): Promise<NutrientGoalResponse[]> => {
  const apiClient = await createAuthenticatedAxiosInstanceFactory({
    additionalHeaders: {},
    origin: "client",
  });
  const response = await apiClient.get("/Goal/all");
  return response.data as NutrientGoalResponse[];
};

const createGoal = async (newGoal: NutrientGoalRequestModel): Promise<NutrientGoalResponse> => {
  const apiClient = await createAuthenticatedAxiosInstanceFactory({
    additionalHeaders: {},
    origin: "client",
  });
  const response = await apiClient.post("/Goal", newGoal);
  return response.data as NutrientGoalResponse;
};

const updateGoal = async ({ id, ...updateData }: { id: string; updateData: NutrientGoalRequestModel }): Promise<NutrientGoalResponse> => {
  const apiClient = await createAuthenticatedAxiosInstanceFactory({
    additionalHeaders: {},
    origin: "client",
  });
  const response = await apiClient.put(`/Goal/${id}`, updateData);
  return response.data as NutrientGoalResponse;
};

const deleteGoal = async (id: string): Promise<void> => {
  const apiClient = await createAuthenticatedAxiosInstanceFactory({
    additionalHeaders: {},
    origin: "client",
  });
  await apiClient.delete(`/Goal/${id}`);
};

const fetchGoalReport = async ({ beginDate, endDate }: { beginDate: Date; endDate: Date }): Promise<PatientNutrientGoalReport[]> => {
  const apiClient = await createAuthenticatedAxiosInstanceFactory({
    additionalHeaders: {},
    origin: "client",
  });
  const beginDateStr = beginDate.toISOString().split('T')[0];
  const endDateStr = endDate.toISOString().split('T')[0];
  const response = await apiClient.get(`/Goal/report?beginDate=${beginDateStr}&endDate=${endDateStr}`);
  return response.data as PatientNutrientGoalReport[];
};

// Custom Hooks
export const useFetchAllGoals = () => useQuery({ queryKey: goalKeys.all, queryFn: fetchAllGoals });

export const useCreateGoal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newGoal: NutrientGoalRequestModel) => createGoal(newGoal),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: goalKeys.all });
    }
  });
}

export const useUpdateGoal = (id: string, updateData: NutrientGoalRequestModel) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => updateGoal({ id, updateData }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: goalKeys.all });
    }
  });
}

export const useDeleteGoal = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteGoal(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: goalKeys.all });
    }
  });
}

export const useFetchGoalReport = (dates: { beginDate: Date; endDate: Date }) => {
  return useQuery({
    queryFn: () => fetchGoalReport(dates),
    queryKey: goalKeys.reports(dates),
  });
}

