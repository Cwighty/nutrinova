'use client'
import { Box, Button, List, Typography } from "@mui/material";
import { PatientInfoModal } from "@/app/(authorized)/patients/_components/PatientInfoModal";
import { PageContainer } from "@/components/PageContainer";
import { useContext, useState } from "react";
import { PatientContext } from "@/components/providers/PatientProvider";
import { CreatePatientReq } from "./_models/patient";
import { PatientForm } from "./_components/PatientInfoForm";
import { useCreatePatientMutation } from '@/app/(authorized)/patients/patientHooks';
import { PatientListItem } from "@/app/(public)/addpatients/_components/PatientListItem";

const PatientsPage = () => {
  const { patients, selectedPatient } = useContext(PatientContext);
  const createPatientMutation = useCreatePatientMutation();

  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    // TODO: how should we handle this?
    // we don't want them deleting themselves either
    console.log("delete");
  }


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
      useDefaultNutrientGoals: patientInfo.optOut,
      hasPicture: !!patientInfo.pff
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
          {patients?.map((patient, index) => (
            <PatientListItem key={index} patient={{ ...patient, pff: patient.base64image, age: patient.age, name: patient.firstname + patient.lastname, optOut: false }} handleDelete={handleDelete} />
          ))}
        </List>
      </PageContainer>
    </>
  );
};

export default PatientsPage;
