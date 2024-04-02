"use client";
import { Button, Grid, List, Paper, Typography } from "@mui/material";
import { PatientInfoModal } from "@/app/(authorized)/patients/_components/PatientInfoModal";
import { PageContainer } from "@/components/PageContainer";
import { useContext, useState } from "react";
import { PatientContext } from "@/components/providers/PatientProvider";
import { CreatePatientReq, Patient } from "./_models/patient";
import { PatientForm } from "./_components/PatientInfoForm";
import {
  useCreatePatientMutation,
  useDeletePatientMutation,
  useUpdatePatientMutation,
} from "@/app/(authorized)/patients/patientHooks";
import { PatientListItem } from "@/app/(public)/addpatients/_components/PatientListItem";
import { Add } from "@mui/icons-material";
import { PatientEditModal } from "./_components/PatientEditModal";
import toast from "react-hot-toast";
import { AcceptDeclineModal } from "./_components/WarningModal";

const PatientsPage = () => {
  const { patients } = useContext(PatientContext);
  const createPatientMutation = useCreatePatientMutation();
  const deletePatientMutation = useDeletePatientMutation();
  const editPatientMutation = useUpdatePatientMutation();

  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openWarningModal, setOpenWarningModal] = useState(false);
  const [selectedEditPatient, setSelectedEditPatient] = useState<Patient | null>(null);

  const handleDelete = ({ id }: Patient) => {
    // TODO: how should we handle this?
    if (id == null) {
      throw new Error("Patient ID is null");
    }
    deletePatientMutation.mutate(id);
    console.log("delete");
  };

  const togglePatientAdd = () => {
    setOpenAddModal(!openAddModal);
  };

  const togglePatientEdit = () => {
    setOpenEditModal(!openEditModal);
  }

  const toggleWarningModal = () => {
    setOpenWarningModal(!openWarningModal);
  }

  const HandlePatientAdd = (patientInfo: PatientForm) => {
    const split_name = patientInfo.name.split(/(?<=^\S+)\s/);
    const patient: CreatePatientReq = {
      firstname: split_name[0],
      lastname: split_name[1] ?? "",
      sex: patientInfo?.sex,
      base64image: patientInfo?.pff,
      age: patientInfo?.age,
      useDefaultNutrientGoals: patientInfo.optOut,
      hasPicture: !!patientInfo.pff,
      optOut: patientInfo.optOut,
    };
    createPatientMutation.mutate(patient);
  };

  const HandlePatientEdit = (patientInfo: PatientForm) => {
    const split_name = patientInfo.name.split(/(?<=^\S+)\s/);

    if (selectedEditPatient === null) {
      toast.error("Please select a patient to edit");
      return;
    }

    const patient: Patient = {
      id: selectedEditPatient.id,
      firstname: split_name[0],
      lastname: split_name[1] ?? "",
      customerId: selectedEditPatient.customerId,
      age: patientInfo?.age,
      sex: selectedEditPatient.sex,
      hasPicture: !!patientInfo.pff,
      base64image: patientInfo.pff,
      optOut: patientInfo.optOut,
    };

    editPatientMutation.mutate(patient);
  }

  return (
    <>
      <PageContainer title="Patients">
        <PatientInfoModal
          patientAge={0}
          openModal={openAddModal}
          onClose={togglePatientAdd}
          submitFunction={HandlePatientAdd}
        />

        {selectedEditPatient && <AcceptDeclineModal
          openModal={openWarningModal}
          decline={toggleWarningModal}
          accept={() => {
            handleDelete(selectedEditPatient);
            setSelectedEditPatient(null);
            togglePatientEdit();
          }}
          warningText="Are you sure you want to delete this patient? This action cannot be undone."
        />}

        {selectedEditPatient && <PatientEditModal
          patient={selectedEditPatient}
          openModal={openEditModal}
          onClose={() => {
            togglePatientEdit();
            setSelectedEditPatient(null);
          }}
          submitFunction={HandlePatientEdit}
        />}

        <Typography variant="h2">Patients</Typography>

        <Paper sx={{ padding: 3 }}>
          <List>
            {patients?.map((patient, index) => (
              <PatientListItem
                key={index}
                patient={{
                  ...patient,
                  pff: patient.base64image,
                  age: patient.age,
                  name: `${patient.firstname} ${patient.lastname}`,
                }}
                handleDelete={() => {
                  setSelectedEditPatient({ ...patient });
                  toggleWarningModal();
                }}
                handleEdit={() => {
                  togglePatientEdit();
                  setSelectedEditPatient({ ...patient });
                }}
              />
            ))}
          </List>
          <Grid
            container
            alignItems={"center"}
            justifyContent={"center"}
            paddingTop={2}
            paddingBottom={2}
          >
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "center", mt: 1 }}
            >
              <Button startIcon={<Add />} onClick={togglePatientAdd}>
                Add Patient
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </PageContainer>
    </>
  );
};

export default PatientsPage;
