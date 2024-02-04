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
import SelectNutrient from "@/components/forms/SelectNutrient";
import { NutrientGoalRequestModel } from "@/app/(authorized)/goals/_models/NutrientGoalRequestModel";
import { Patient } from "@/app/(authorized)/patients/_models/patient";

interface Props {
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
}: Props) => {
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
        <DialogTitle>Create a nutrient goal for {selectedPatient.firstname}</DialogTitle>
        <DialogContent>
          <SelectNutrient
            onSelectedNutrientChange={(selectedNutrient) => {
              selectedNutrient &&
                setNewGoal({
                  ...newGoal,
                  nutrientId: selectedNutrient.id,
                  patientId: selectedPatient.id!,
                });
            }}
            onNutrientAmountChange={(newAmount) => {
              setNewGoal({
                ...newGoal,
                dailyGoalAmount: newAmount ?? 0,
              });
            }} />
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
