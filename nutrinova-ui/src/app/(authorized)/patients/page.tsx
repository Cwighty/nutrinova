'use client'
import CreatePatientDialog from "./_components/CreatePatientDialog";
import { Box, IconButton, List, ListItem, Typography } from "@mui/material";
import { PageContainer } from "@/components/PageContainer";
import { useContext } from "react";
import { PatientContext } from "@/components/providers/PatientProvider";
import { Delete } from "@mui/icons-material";
import { Patient } from "./_models/patient";

const PatientsPage = () => {
  const { patients } = useContext(PatientContext);

  const handleDelete = (patient: Patient) => {
    // TODO: how should we handle this?
    // we don't want them deleting themselves either
  }

  return (
    <>
      <PageContainer title="Patients">
        <Box>
          <Typography variant="button">Add a Patient</Typography>
          <CreatePatientDialog />
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
