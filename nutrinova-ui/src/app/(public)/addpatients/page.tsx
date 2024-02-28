"use client"
import { PatientForm } from '@/app/(authorized)/patients/_components/PatientInfoForm';
import { PatientInfoModal } from '@/app/(authorized)/patients/_components/PatientInfoModal';
import { Customer, customerService } from '@/services/customerService';
import { Add } from '@mui/icons-material';
import { ListItem, ListItemAvatar, Avatar, ListItemText, Box, Typography, List, Button, Container } from '@mui/material';
import { getSession } from 'next-auth/react';
import { useState } from 'react'
import { useRouter } from 'next/navigation';
import { CreatePatientReq } from '@/app/(authorized)/patients/_models/patient';
import { useCreatePatientMutation } from '@/app/(authorized)/patients/patientHooks';


interface PatientListItemProps {
  patient: PatientForm;
}

const PatientListItem = ({ patient }: PatientListItemProps) => {
  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar>{patient.name.charAt(0)}</Avatar>
      </ListItemAvatar>
      <ListItemText primary={patient.name} secondary={`Age: ${patient.optOut ? 19 : patient.age}`} />
    </ListItem>
  );
};


const AddPatientPage = () => {
  const [patients, setPatients] = useState<PatientForm[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const createPatientMutation = useCreatePatientMutation();


  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitPatient = (patient: PatientForm) => {
    setPatients(prevPatients => [...prevPatients, patient]);
  };


  const handleMultiUserSubmission = async (patientInfo: PatientForm[]) => {
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
      issingleuser: false,
    } as Customer;

    const created = await customerService.createCustomer(customer);
    if (!created) {
      throw new Error('Failed to create customer');
    }
    patientInfo.forEach(element => {
      const patient: CreatePatientReq = {
        firstname: element.name.split(' ')[0],
        lastname: element.name.split(' ')[1] ?? '',
        sex: element?.sex,
        base64image: element?.pff,
        age: element?.age,
        useDefaultNutrientGoals: element.optOut
      }
      createPatientMutation.mutate(patient);
    });

    router.push('/dashboard');
  }
  return (
    <Container>
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
          <Button variant="contained" onClick={() => handleMultiUserSubmission(patients)}>Done</Button>
        </Box>
      </Box>
    </Container>
  );
};
export default AddPatientPage;