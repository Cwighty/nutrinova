"use client"
import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import React from 'react'
import { PatientForm, PatientInfoForm } from './PatientInfoForm';
import { Patient } from '../_models/patient';

interface patientModalProps {
  patient: Patient;
  openModal: boolean;
  onClose: () => void;
  submitFunction: (patient: PatientForm) => void;
}

export const PatientEditModal = ({ openModal, onClose, patient, submitFunction }: patientModalProps) => {

  const hadleSubmit = (patient: PatientForm) => {
    submitFunction(patient);
    onClose();
  }

  return (
    <Dialog open={openModal} onClose={onClose}>
      <DialogTitle>
        Edit
      </DialogTitle>
      <DialogContent>
        <PatientInfoForm optout={patient.optOut} name={patient.firstname + patient.lastname} age={patient.age} sex={patient.sex} onSubmit={hadleSubmit} />
      </DialogContent>
    </Dialog>
  )
}
