import createAuthenticatedAxiosInstanceFactory from "@/services/axiosRequestFactory";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Patient } from "./_models/patient";
import { getSession } from "next-auth/react";
import { customerService } from "@/services/customerService";

export const patientKeys = {
  all: ['patients'],
  details: ['patientDetails'],
};

// Fetch all patients
const getAllPatients = async () => {
  const apiClient = await createAuthenticatedAxiosInstanceFactory({
    additionalHeaders: {},
    origin: "client",
  });
  const session = await getSession();
  if (session == null || session == undefined) {
    return [];
  }
  const exists = await customerService.customerExists('client') as boolean;
  if (!exists) {
    return [];
  }
  const response = await apiClient.get<Patient[]>('/patient/all-patients');
  return response.data;
};

export const useGetAllPatientsQuery = () => {
  return useQuery({
    queryKey: [patientKeys.all],
    queryFn: () => getAllPatients(),
  });
};

// Create a new patient
const createPatient = async (patient: Patient) => {
  const apiClient = await createAuthenticatedAxiosInstanceFactory({
    additionalHeaders: {},
    origin: 'client',
  });
  const response = await apiClient.post('/patient/create-patient', patient);
  return response.status === 200;
};

export const useCreatePatientMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPatient,
    onSuccess: async () => {
      toast.success('Patient created successfully');
      await queryClient.invalidateQueries({ queryKey: [patientKeys.all] });
    },
    onError: (error) => {
      toast.error('Error creating patient: ' + error.message);
      console.error(error);
    },
  });
};

// Fetch patient details by ID
const getPatientById = async (patientId: string) => {
  const apiClient = await createAuthenticatedAxiosInstanceFactory({
    additionalHeaders: {},
    origin: 'client',
  });
  const response = await apiClient.get<Patient>(`/patient/${patientId}`);
  return response.data;
};

export const useGetPatientByIdQuery = (patientId: string) => {
  return useQuery({
    queryKey: [patientKeys.details, patientId],
    queryFn: () => getPatientById(patientId),
  });
};

const getCurrentPatientImage = async (patientId: string) => {
  const apiClient = await createAuthenticatedAxiosInstanceFactory({
    additionalHeaders: {},
    origin: 'client',
  });
  const response = await apiClient.get(`/patient/image/${patientId}`, { responseType: 'blob' });
  console.log("response", response);
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(response.data as Blob); // Converts Blob to Base64
    reader.onloadend = function () {
      const base64data = reader.result;
      console.log(base64data); // Log or use the Base64 string as needed
      resolve(base64data); // Resolve the promise with the Base64 string
    };
    reader.onerror = reject;
  });
}

export const useGetCurrentPatientImageQuery = (patientId: string) => {
  return useQuery({
    queryKey: [patientKeys.details, patientId],
    queryFn: () => getCurrentPatientImage(patientId),
  });
};