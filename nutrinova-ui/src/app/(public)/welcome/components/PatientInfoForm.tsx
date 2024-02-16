"use client"
import { CloudUpload } from '@mui/icons-material';
import { Button, Checkbox, FormControlLabel, Grid, MenuItem, Select, SelectChangeEvent, TextField, styled } from '@mui/material'
import React, { useState } from 'react'

export interface PatientForm {
  name: string;
  age?: number;
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
  onSubmit: (patient: PatientForm) => void;
}

export const PatientInfoForm = ({ name, age, onSubmit }: patientInfoFormProps) => {

  const patient: PatientForm = {
    name: name,
    age: age,
    sex: 'M',
    optOut: false,
    pff: ''
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
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
      optOut: value
    })
  }

  const [formPatient, setFormPatient] = useState(patient);

  const handleChange = (property: string, e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>) => {
    console.log('property', e.target.value);
    setFormPatient({
      ...formPatient,
      [property]: e.target.value
    })
  }

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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('name', e)}
            fullWidth
          >
          </TextField>
        </Grid>
        {/* age */}
        <Grid item xs={12} sx={
          {
            display: formPatient.optOut ? 'none' : 'inherit'
          }
        }>
          <TextField
            label="Age"
            type="number"
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
        <Grid container justifyContent={"flex-start"}>
          <Grid item xs={12}>
            <Button onClick={() => onSubmit(formPatient)}>Submit</Button>
          </Grid>
        </Grid>
      </Grid >
    </>
  )
}
