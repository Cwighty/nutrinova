"use client"
import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import React from 'react'
import { Patient } from '@/app/(authorized)/patients/_models/patient';
import { PatientForm, PatientInfoForm } from './PatientInfoForm';
import { useCreatePatientMutation } from '@/app/(authorized)/patients/patientHooks';
import { useRouter } from 'next/navigation';
import { customerService, Customer } from '@/services/customerService';
import { getSession } from 'next-auth/react';


interface patientModalProps {
  openModal: boolean;
  onClose: () => void;
  defaultName?: string;
}

export const PatientInfoModal = ({ openModal, onClose, defaultName = '' }: patientModalProps) => {
  const router = useRouter();
  const createPatientMutation = useCreatePatientMutation();


  const handleSingleUser = async (patientInfo: PatientForm) => {
    const session = await getSession();

    if (session == null || session == undefined) {
      throw new Error('Failed to get user session');
    }

    if (await customerService.customerExists("client")) {
      router.push('/dashboard');
      return;
    }

    const customer = {
      objectId: session.user.id,
      email: session.user.email,
      issingleuser: true,
    } as Customer;

    const created = await customerService.createCustomer(customer);
    if (!created) {
      throw new Error('Failed to create customer');
    }

    const patient: Patient = {
      firstname: patientInfo.name.split(' ')[0],
      lastname: patientInfo.name.split(' ')[1] ?? '',
      sex: patientInfo?.sex,
      pff: patientInfo?.pff,
      age: patientInfo?.age,
    }
    createPatientMutation.mutate(patient);

    router.push('/dashboard');
  }

  return (
    <Dialog open={openModal} onClose={onClose}>
      <DialogTitle>
        We Need Some Information
      </DialogTitle>
      <DialogContent>
        <PatientInfoForm name={defaultName} age={0} onSubmit={handleSingleUser} />
      </DialogContent>
    </Dialog>
  )
}
