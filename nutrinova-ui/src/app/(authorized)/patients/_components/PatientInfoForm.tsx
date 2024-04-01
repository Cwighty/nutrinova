"use client"
import { CloudUpload } from '@mui/icons-material';
import toast from "react-hot-toast";
import { Button, Checkbox, FormControlLabel, Grid, MenuItem, Select, SelectChangeEvent, TextField, styled } from '@mui/material'
import React, { useState } from 'react'

export interface PatientForm {
  name: string;
  age: number;
  sex?: 'M' | 'F' | 'O';
  optOut: boolean;
  pff?: string;
}

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

interface patientInfoFormProps {
  name: string;
  age: number;
  optout?: boolean;
  sex?: 'M' | 'F' | 'O';
  onSubmit: (patient: PatientForm) => void;
}

export const PatientInfoForm = ({ name, age = 1, onSubmit, optout, sex }: patientInfoFormProps) => {

  const patient: PatientForm = {
    name: name,
    age: age,
    sex: sex ?? "M",
    optOut: optout ?? false,
    pff: ''
  }

  const [formPatient, setFormPatient] = useState(patient);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 1048576000) { // 1000 MB in bytes
        toast.error('File size must be 1000 MB or smaller.');
        return; // Do not proceed further
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormPatient({
          ...formPatient,
          pff: reader.result as string, // Update the form state with the Base64 string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const optOut = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.checked;
    setFormPatient({
      ...formPatient,
      optOut: value,
      age: value ? 1 : 0,
    })
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formPatient);
    } else {
      console.log("formPatient", formPatient)
      toast.error('Please correct the errors before submitting.');
    }
  };

  const handleChange = (property: string, e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>) => {
    console.log('property', e.target.value);
    setFormPatient({
      ...formPatient,
      [property]: e.target.value
    })
  }

  const validateForm = () => {
    return !isNameError && !isAgeError;
  };

  const isNameError = formPatient.name.length === 0 || formPatient.name == null || formPatient.name === undefined;
  const isAgeError = formPatient.age !== undefined && formPatient.age <= 0;

  const optOutLabel = { inputProps: { 'aria-label': 'Opt out' } };
  return (
    <>
      <Grid container justifyContent={'flex-start'} spacing={2}>
        {/* file upload */}
        <Grid item xs={12}>
          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUpload />}
          >
            Upload Picture
            <VisuallyHiddenInput
              type="file"
              onChange={handleFileChange} // Add onChange handler to process the file input
              accept="image/*" // Optional: Restrict file input to image files
            />
          </Button>
          {/* Display uploaded image if available */}
          {formPatient.pff && (
            <img src={formPatient.pff} alt="Uploaded" style={{ marginTop: '10px', maxWidth: '100%', height: 'auto' }} />
          )}
        </Grid>
        {/* name */}
        <Grid item xs={12}>
          <TextField
            label="Name"
            type="text"
            value={formPatient.name}
            error={isNameError}
            helperText={isNameError ? "Name Cannot be empty" : ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('name', e)}
            fullWidth
          >
          </TextField>
          {/* age */}
          {formPatient.optOut &&
            <p>
              By opting out we will use default nutrition goals for your recommended diet. This will not stop you from adding your own goals later.
            </p>
          }
        </Grid>
        <Grid item xs={12} sx={
          {
            display: formPatient.optOut ? 'none' : 'inherit'
          }
        }>
          <TextField
            label="Age"
            type="number"
            error={isAgeError}
            helperText={isAgeError ? "Age must be greater than 0" : ""}
            value={formPatient.age}
            fullWidth
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('age', e)}
          >
          </TextField>
        </Grid>
        {/* sex */}
        <Grid item xs={12} sx={
          {
            display: formPatient.optOut ? 'none' : 'inherit'
          }
        }>
          <Select
            label="Sex"
            value={formPatient.sex}
            fullWidth
            onChange={(e: SelectChangeEvent<string>) => handleChange('sex', e)}
          >
            <MenuItem value={'M'}>Male</MenuItem>
            <MenuItem value={'F'}>Female</MenuItem>
            <MenuItem value={'O'}>Other</MenuItem>
          </Select>
        </Grid>
        {/* check box to opt out */}
        <Grid item xs={12}>
          <FormControlLabel control={<Checkbox
            {...optOutLabel}
            checked={formPatient.optOut}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => optOut(e)}
          />} label="I want to opt out of giving this information" />

        </Grid>
        <Grid item xs={12} >
          <Button sx={
            {
              padding: '0px',
              margin: '0px',
            }
          }
            onClick={() => handleSubmit()}>Submit</Button>
        </Grid>
      </Grid >
    </>
  )
}
