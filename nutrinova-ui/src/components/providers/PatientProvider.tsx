'use client'
import React, { createContext, useState, useMemo, ReactNode, useEffect } from 'react';
import { Patient } from '@/app/(authorized)/patients/_models/patient';
import { useGetAllPatientsQuery } from '@/app/(authorized)/patients/patientHooks';

export interface PatientContextProps {
  patients: Patient[] | undefined;
  selectedPatient: Patient | null;
  setSelectedPatient: (patient: Patient | null) => void;
  isLoading: boolean;
  isError: boolean;
}

export const PatientContext = createContext({} as PatientContextProps);


export const PatientProvider = ({ children }: { children: ReactNode }) => {
  const { data: patients, isLoading, isError } = useGetAllPatientsQuery();
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(patients?.[0] ?? null);

  useEffect(() => {
    if (patients != null && selectedPatient == null) {
      setSelectedPatient(patients?.[0] ?? null);
    }
  }, [patients, selectedPatient]);

  const contextValue = useMemo(() => ({
    patients,
    selectedPatient,
    setSelectedPatient,
    isLoading,
    isError
  }), [isError, isLoading, patients, selectedPatient]);

  return (
    <PatientContext.Provider value={contextValue}>
      {children}
    </PatientContext.Provider>
  );
};
