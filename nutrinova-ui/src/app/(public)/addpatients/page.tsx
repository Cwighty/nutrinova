"use client"
import { PatientForm } from '@/app/(authorized)/patients/_components/PatientInfoForm';
import { PatientInfoModal } from '@/app/(authorized)/patients/_components/PatientInfoModal';
import { Add } from '@mui/icons-material';
import { ListItem, ListItemAvatar, Avatar, ListItemText, Box, Typography, List, Button } from '@mui/material';
import { useState } from 'react'

interface PatientListItemProps {
  patient: PatientForm;
}

const PatientListItem = ({ patient }: PatientListItemProps) => {
  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar>{patient.name.charAt(0)}</Avatar>
      </ListItemAvatar>
      <ListItemText primary={patient.name} secondary={`Age: ${patient.age}`} />
    </ListItem>
  );
};

const AddPatientPage = () => {
  const [patients, setPatients] = useState<PatientForm[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitPatient = (patient: PatientForm) => {
    setPatients(prevPatients => [...prevPatients, patient]);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Who will you be caring for?
      </Typography>
      <List>
        {patients.map((patient, index) => (
          <PatientListItem key={index} patient={patient} />
        ))}
      </List>
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={handleOpenModal}
      >
        Add Patient
      </Button>
      <PatientInfoModal
        openModal={isModalOpen}
        onClose={handleCloseModal}
        submitFunction={handleSubmitPatient}
      />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button variant="contained">Done</Button>
      </Box>
    </Box>
  );
};
export default AddPatientPage;