'use client'
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Button, TextField, Typography, Container, Paper } from '@mui/material';
import { useCreatePatientMutation } from '../patientHooks';
import { Patient } from '../_models/patient';


const CreatePatientForm: React.FC = () => {
  const [patientDetails, setPatientDetails] = useState<Patient>({
    firstname: '',
    lastname: '',
  });

  const createPatientMutation = useCreatePatientMutation();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createPatientMutation.mutate(patientDetails);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPatientDetails({ ...patientDetails, [event.target.name]: event.target.value });
  };

  return (
    <Container component={Paper} style={{ padding: '20px', marginTop: '20px' }}>
      <Typography variant="h5">Who will you be caring for?</Typography>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
        <TextField
          label="First Name"
          variant="outlined"
          name="firstname"
          value={patientDetails.firstname}
          onChange={handleChange}
          required
        />
        <TextField
          label="Last Name"
          variant="outlined"
          name="lastname"
          value={patientDetails.lastname}
          onChange={handleChange}
        />
        <Button type="submit" variant="contained" color="primary">
          Create Patient
        </Button>
      </form>
    </Container>
  );
};

export default CreatePatientForm;
