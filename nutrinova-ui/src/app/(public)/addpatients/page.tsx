"use client"
import { PatientForm } from '@/app/(authorized)/patients/_components/PatientInfoForm';
import { PatientInfoModal } from '@/app/(authorized)/patients/_components/PatientInfoModal';
import { Customer, customerService } from '@/services/customerService';
import { Add } from '@mui/icons-material';
import { Box, Typography, List, Button, Container, Grid } from '@mui/material';
import { getSession } from 'next-auth/react';
import { useState } from 'react'
import { useRouter } from 'next/navigation';
import { CreatePatientReq } from '@/app/(authorized)/patients/_models/patient';
import { useCreatePatientMutation } from '@/app/(authorized)/patients/patientHooks';
import { PatientListItem } from './_components/PatientListItem';


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
        <Grid container alignItems={'center'}  >
          <Grid item xs={6}>
            <Typography variant="h1" gutterBottom>
              Who will you be caring for?
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button variant="contained" onClick={() => handleMultiUserSubmission(patients)}>Done</Button>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <List>
              {patients.map((patient, index) => (
                <PatientListItem key={index} patient={patient} />
              ))}
            </List>
          </Grid>
          <Grid item xs={12}>

            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleOpenModal}
            >
              Add Patient
            </Button>
          </Grid>
          <PatientInfoModal
            openModal={isModalOpen}
            onClose={handleCloseModal}
            submitFunction={handleSubmitPatient}
          />
        </Grid>
      </Box>
    </Container>
  );
};
export default AddPatientPage;