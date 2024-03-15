"use client";
import { PatientForm } from '@/app/(authorized)/patients/_components/PatientInfoForm';
import { Delete } from '@mui/icons-material';
import { ListItem, ListItemAvatar, Avatar, ListItemText, Paper, IconButton } from '@mui/material';

export interface PatientListItemProps {
  patient: PatientForm;
  handleDelete: (patient: PatientForm) => void;
}

export const PatientListItem = ({ patient, handleDelete }: PatientListItemProps) => {
  return (
    <Paper elevation={6} sx={{
      mb: 2
    }}>
      <ListItem secondaryAction={<IconButton onClick={() => handleDelete(patient)}>
        <Delete />
      </IconButton>}>
        <ListItemAvatar>
          <Avatar src={`${patient.pff}`}>{patient.name.charAt(0)}</Avatar>
        </ListItemAvatar>
        <ListItemText primary={patient.name} secondary={!patient?.optOut ? `Age: ${patient.age}` : 'Patient opted out of sharing personal details.'} />

      </ListItem>
    </Paper >
  );
};
