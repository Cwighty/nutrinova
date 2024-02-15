import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import React from 'react'
import { PatientInfoForm } from './PatientInfoForm';

interface patientModalProps {
  openModal: boolean;
  onClose: () => void;
  defaultName?: string;
}

export const PatientInfoModal = ({ openModal, onClose, defaultName = '' }: patientModalProps) => {
  return (
    <Dialog open={openModal} onClose={onClose}>
      <DialogTitle>
        We Need Some Information
      </DialogTitle>
      <DialogContent>
        <PatientInfoForm name={defaultName} age={0} />
      </DialogContent>
    </Dialog>
  )
}
