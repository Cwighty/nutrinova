"use client";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import React, { useState } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { NutrientGoalRequestModel } from "@/app/(authorized)/goals/_models/NutrientGoalRequestModel";
import { Patient } from "@/app/(authorized)/patients/_models/patient";
import { CreateGoalModalContent } from "@/app/(authorized)/goals/CreateGoalModalContent";

interface CreatePatientNutrientGoalModalProps {
  handleSubmit: () => void;
  newGoal: NutrientGoalRequestModel;
  setNewGoal: (newGoal: NutrientGoalRequestModel) => void;
  selectedPatient: Patient;
}

export const CreatePatientNutrientGoalModal = ({
  handleSubmit,
  newGoal,
  setNewGoal,
  selectedPatient,
}: CreatePatientNutrientGoalModalProps) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const submit = () => {
    handleSubmit();
    handleClose();
  };
  return (
    <>
      <Button startIcon={<AddCircleOutlineIcon />} onClick={handleOpen}>
        New Goal
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          Create a nutrient goal for {selectedPatient.firstname}
        </DialogTitle>
        <DialogContent>
          <CreateGoalModalContent
            onSelectedNutrientChange={(selectedNutrient) => {
              selectedNutrient &&
                setNewGoal({
                  ...newGoal,
                  nutrientId: selectedNutrient.id,
                  patientId: selectedPatient.id!,
                });
            }}
            newGoal={newGoal}
            setNewGoal={setNewGoal}
            patientName={selectedPatient.firstname}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              submit();
            }}
            color="primary"
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
