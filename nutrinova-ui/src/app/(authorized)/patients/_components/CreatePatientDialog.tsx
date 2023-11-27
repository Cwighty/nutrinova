'use client'
import React, { useState, ChangeEvent } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Typography } from '@mui/material';
import { useCreatePatientMutation } from '../patientHooks';
import { Patient } from '../_models/patient';
import { AddCircleOutline } from '@mui/icons-material';


const CreatePatientDialog: React.FC = () => {
  const [patientDetails, setPatientDetails] = useState<Patient>({
    firstname: '',
    lastname: '',
  });

  const [open, setOpen] = useState(false);

  const createPatientMutation = useCreatePatientMutation();

  const handleSubmit = () => {
    createPatientMutation.mutate(patientDetails, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPatientDetails({ ...patientDetails, [event.target.name]: event.target.value });
  };

  return (
    <>
      <IconButton onClick={() => setOpen(true)}>
        <AddCircleOutline />
      </IconButton>
      <Dialog open={open}>
        <DialogTitle>Add Patient</DialogTitle>
        <DialogContent>
          <Typography variant="h5">Who will you be caring for?</Typography>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
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
              required
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpen(false) }}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary" onClick={handleSubmit}>
            Create Patient
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreatePatientDialog;
