"use client"
import React, { useState } from 'react';
import { Typography, Grid, Container, Box, Card, CardContent, Button } from '@mui/material';
import { ArrowCircleRight } from '@mui/icons-material';
import { getSession } from 'next-auth/react';
import { PatientInfoModal } from '../../(authorized)/patients/_components/PatientInfoModal';
import { PatientForm } from '@/app/(authorized)/patients/_components/PatientInfoForm';
import { useCreatePatientMutation } from '@/app/(authorized)/patients/patientHooks';
import { useRouter } from 'next/navigation';
import { customerService, Customer } from '@/services/customerService';
import { CreatePatientReq } from '@/app/(authorized)/patients/_models/patient';


const Welcome = () => {

  const [openSingleCustomerModal, setOpenModal] = useState(false);

  const [name, setName] = useState('' as string);

  const getUserName = async () => {
    const session = await getSession();
    if (session == null || session == undefined) {
      throw new Error('Failed to get user session');
    }
    setName(session.user.name);
  }

  const toggleCustomerInfoModal = async () => {
    await getUserName();
    setOpenModal(!openSingleCustomerModal);
  }

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

    const patient: CreatePatientReq = {
      firstname: patientInfo.name.split(' ')[0],
      lastname: patientInfo.name.split(' ')[1] ?? '',
      sex: patientInfo?.sex,
      base64image: patientInfo?.pff,
      age: patientInfo?.age,
      useDefaultNutrientGoals: patientInfo.optOut
    }
    createPatientMutation.mutate(patient);

    router.push('/dashboard');
  }

  return (
    <Container>
      <PatientInfoModal openModal={openSingleCustomerModal} onClose={toggleCustomerInfoModal} patientName={name} submitFunction={handleSingleUser} />
      <Typography variant="h3" gutterBottom align="center" fontWeight="bold">
        Welcome to Nutrinova!
      </Typography>

      <Typography variant="h4" gutterBottom align="center" >
        How will you be using the application?
      </Typography>
      <Grid container spacing={4} justifyContent="center" alignItems="center">
        <Grid item xs={12}>
          <Box component="img" src="/single-multiple.png" alt="Self Care" sx={{ width: '80%', height: 'auto', mb: 4, display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />
        </Grid>

        <Grid item xs={12} sm={10}>
          <Card elevation={3}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="h6" gutterBottom textAlign={"center"}>
                    Track My Own Nutrition
                  </Typography>
                  <Typography variant="body2" color="textSecondary" textAlign="center">
                    Monitor and improve your dietary habits.
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="h6" gutterBottom textAlign="center">
                    Care For Someone Else
                  </Typography>
                  <Typography variant="body2" color="textSecondary" textAlign="center">
                    Assist others in tracking and improving their nutrition.
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Box display="flex" justifyContent="center">
                    <Button color="primary" onClick={() => toggleCustomerInfoModal()}>
                      <ArrowCircleRight fontSize={'large'} />
                    </Button>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box display="flex" justifyContent="center">
                    <Button color="primary" onClick={() => { router.push('/addpatients') }}>
                      <ArrowCircleRight fontSize={'large'} />
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Welcome;