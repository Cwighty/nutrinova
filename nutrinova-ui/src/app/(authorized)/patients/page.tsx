'use client'
import { Box, Button, IconButton, List, ListItem, Typography } from "@mui/material";
import { PatientInfoModal } from "@/app/(authorized)/patients/_components/PatientInfoModal";
import { PageContainer } from "@/components/PageContainer";
import { useContext, useState } from "react";
import { PatientContext } from "@/components/providers/PatientProvider";
import { Delete } from "@mui/icons-material";
import { CreatePatientReq, Patient } from "./_models/patient";
import { PatientForm } from "./_components/PatientInfoForm";
import { useCreatePatientMutation } from '@/app/(authorized)/patients/patientHooks';

const PatientsPage = () => {
  const { patients, selectedPatient } = useContext(PatientContext);
  const createPatientMutation = useCreatePatientMutation();


  const handleDelete = (patient: Patient) => {
    // TODO: how should we handle this?
    // we don't want them deleting themselves either
    console.log("delete", patient);
  }

  const [open, setOpen] = useState(false);

  const toggleOpen = () => {
    setOpen(!open);
  }

  const HandlePatientAdd = (patientInfo: PatientForm) => {
    const patient: CreatePatientReq = {
      firstname: patientInfo.name.split(' ')[0],
      lastname: patientInfo.name.split(' ')[1] ?? '',
      sex: patientInfo?.sex,
      base64image: patientInfo?.pff,
      age: patientInfo?.age,
      useDefaultNutrientGoals: patientInfo.optOut
    }
    createPatientMutation.mutate(patient);
  }


  return (
    <>
      <PageContainer title="Patients">
        <Box>
          <Button onClick={toggleOpen}>Add a Patient</Button>
          <PatientInfoModal patientAge={selectedPatient?.age} openModal={open} onClose={toggleOpen} submitFunction={HandlePatientAdd} />
        </Box >

        <Typography variant="button">Patients</Typography>
        <List>
          {patients?.map(patient => (
            <>
              <ListItem>
                <Typography variant="body1" key={patient.id}>{patient.firstname} {patient.lastname}</Typography>
                <IconButton onClick={() => handleDelete(patient)}>
                  <Delete />
                </IconButton>
              </ListItem>
            </>
          ))}
        </List>
      </PageContainer>
    </>
  );
};

export default PatientsPage;
