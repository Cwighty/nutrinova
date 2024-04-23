import createAuthenticatedAxiosInstanceFactory from "@/services/axiosRequestFactory";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { NutrientGoalResponse } from "./_models/NutrientGoalResponse";
import { NutrientGoalRequestModel } from "./_models/NutrientGoalRequestModel";
import { AggregatePatientNutrientReport } from "./_models/AggregatePatientNutrientReport";
import { NutrientRecommendationResponse } from "./_models/NutrientRecommendationResponseModel";
import axios from "axios";

const goalKeys = {
  all: ["goals"] as const,
  reportsandgoals: ["goals", "goalReports"] as const,
};

const fetchAllGoals = async (): Promise<NutrientGoalResponse[]> => {
  const apiClient = await createAuthenticatedAxiosInstanceFactory({
    additionalHeaders: {},
    origin: "client",
  });
  const response = await apiClient.get("/Goal/all");
  return response.data as NutrientGoalResponse[];
};

const createGoal = async (
  newGoal: NutrientGoalRequestModel,
): Promise<NutrientGoalResponse> => {
  const apiClient = await createAuthenticatedAxiosInstanceFactory({
    additionalHeaders: {},
    origin: "client",
  });
  const response = await apiClient.post("/Goal", newGoal);
  return response.data as NutrientGoalResponse;
};

const updateGoal = async ({
  id,
  ...updateData
}: {
  id: string;
  updateData: NutrientGoalRequestModel;
}): Promise<NutrientGoalResponse> => {
  const apiClient = await createAuthenticatedAxiosInstanceFactory({
    additionalHeaders: {},
    origin: "client",
  });
  const response = await apiClient.put(`/Goal/${id}`, updateData);
  return response.data as NutrientGoalResponse;
};

const deleteGoal = async (id: number): Promise<void> => {
  const apiClient = await createAuthenticatedAxiosInstanceFactory({
    additionalHeaders: {},
    origin: "client",
  });
  await apiClient.delete(`/Goal/${id}`);
};

const fetchGoalReports = async ({ beginDate, endDate }: { beginDate: Date; endDate: Date }): Promise<AggregatePatientNutrientReport> => {
  const apiClient = await createAuthenticatedAxiosInstanceFactory({
    additionalHeaders: {},
    origin: "client",
  });
  const beginDateStr = beginDate.toISOString().split('T')[0];
  const endDateStr = endDate.toISOString().split('T')[0];
  const response = await apiClient.get(`/Goal/report?beginDate=${beginDateStr}&endDate=${endDateStr}`);
  return response.data as AggregatePatientNutrientReport;
};

// Custom Hooks
export const useFetchAllGoals = () =>
  useQuery({ queryKey: goalKeys.all, queryFn: fetchAllGoals });

export const useCreateGoal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newGoal: NutrientGoalRequestModel) => createGoal(newGoal),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: goalKeys.reportsandgoals,
      });
    },
  });
};

export interface FetchGoalReportsByNutrientParams {
  beginDate: Date;
  endDate: Date;
  nutrientId: number;
  patientId: string;
}

const fetchGoalReportsByNutrient = async ({ beginDate, endDate, nutrientId, patientId }: FetchGoalReportsByNutrientParams) => {
  const apiClient = await createAuthenticatedAxiosInstanceFactory({
    additionalHeaders: {},
    origin: "client",
  });
  const beginDateStr = beginDate.toISOString().split('T')[0];
  const endDateStr = endDate.toISOString().split('T')[0];
  const response = await apiClient.get(`/Goal/report?beginDate=${beginDateStr}&endDate=${endDateStr}&nutrientId=${nutrientId}&patientId=${patientId}`);
  return response.data as AggregatePatientNutrientReport;
}


export const useFetchGoalReportByNutrient = (beginDate: Date, endDate: Date, nutrientId: number, patientId: string) => {
  return useQuery({
    queryFn: () => fetchGoalReportsByNutrient({ beginDate, endDate, nutrientId, patientId }),
    queryKey: ["goalReports", beginDate, endDate, nutrientId, patientId],
  });
}

export const useUpdateGoal = (
  id: string,
  updateData: NutrientGoalRequestModel,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => updateGoal({ id, updateData }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: goalKeys.all });
    },
  });
};

export const useDeleteGoal = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteGoal(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: goalKeys.all });
    },
  });
};

export const useFetchGoalReport = (dates: {
  beginDate: Date;
  endDate: Date;
}) => {
  return useQuery({
    queryFn: () => fetchGoalReports(dates),
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: goalKeys.reportsandgoals,
  });
};

export const fetchNutrientRecommendation = async (
  patientId: string | undefined,
  nutrientId: number | undefined,
): Promise<NutrientRecommendationResponse | null> => {
  const apiClient = await createAuthenticatedAxiosInstanceFactory({
    additionalHeaders: {},
    origin: "client",
  });
  try {
    const response = await apiClient.get(
      `/Goal/recommendation?patientId=${patientId}&nutrientId=${nutrientId}`,
    );
    return response.data as NutrientRecommendationResponse;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

export const useFetchNutrientRecommendation = (
  patientId: string | undefined,
  nutrientId: number | undefined,
) => {
  return useQuery({
    queryFn: () => fetchNutrientRecommendation(patientId, nutrientId),
    queryKey: ["nutrientRecommendation", patientId, nutrientId],
    enabled: !!patientId && !!nutrientId,
  });
};
