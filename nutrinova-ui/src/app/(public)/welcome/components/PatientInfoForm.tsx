"use client"
import { Grid, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material'
import React, { useState } from 'react'

interface patientInfoFormProps {
  name: string;
  age: number;
}

export const PatientInfoForm = ({ name, age }: patientInfoFormProps) => {

  const patient = {
    name: name,
    age: age,
    sex: 'M',
    optOut: false,
    ppf: ''
  }

  const [formPatient, setFormPatient] = useState(patient);

  const handleChange = (property: string, e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>) => {
    setFormPatient({
      ...formPatient,
      [property]: e.target.value
    })
  }


  return (
    <>
      <Grid container justifyContent={'flex-start'} spacing={2}>
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
        <Grid item xs={12}>
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
        <Grid item xs={12}>
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
          <TextField
            label="I do not want to provide this information"
            type="checkbox"
            value={formPatient.optOut}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('optOut', e)}
            fullWidth>
          </TextField >
        </Grid>
      </Grid>
    </>
  )
}
