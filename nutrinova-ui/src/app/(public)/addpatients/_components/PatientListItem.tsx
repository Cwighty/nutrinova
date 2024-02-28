"use client";
import { PatientForm } from '@/app/(authorized)/patients/_components/PatientInfoForm';
import { ListItem, ListItemAvatar, Avatar, ListItemText, ListItemButton } from '@mui/material';

export interface PatientListItemProps {
  patient: PatientForm;
  handleDelete: (patient: PatientForm) => void;
}

export const PatientListItem = ({ patient, handleDelete }: PatientListItemProps) => {
  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar>{patient.name.charAt(0)}</Avatar>
      </ListItemAvatar>
      <ListItemText primary={patient.name} secondary={`Age: ${patient.optOut ? 19 : patient.age}`} />
      <ListItemButton onClick={() => handleDelete(patient)}> Delete </ListItemButton>
    </ListItem>
  );
};
