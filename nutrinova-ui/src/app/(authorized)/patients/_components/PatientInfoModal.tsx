"use client"
import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import React from 'react'
import { PatientForm, PatientInfoForm } from './PatientInfoForm';



interface patientModalProps {
  openModal: boolean;
  onClose: () => void;
  patientName?: string;
  patientAge?: number;
  submitFunction: (patient: PatientForm) => void;
}

export const PatientInfoModal = ({ openModal, onClose, patientName: defaultName = '', submitFunction, patientAge }: patientModalProps) => {

  const hadleSubmit = (patient: PatientForm) => {
    submitFunction(patient);
    onClose();
  }

  return (
    <Dialog open={openModal} onClose={onClose}>
      <DialogTitle>
        We Need Some Information
      </DialogTitle>
      <DialogContent>
        <PatientInfoForm name={defaultName} age={patientAge ?? 0} onSubmit={hadleSubmit} />
      </DialogContent>
    </Dialog>
  )
}
