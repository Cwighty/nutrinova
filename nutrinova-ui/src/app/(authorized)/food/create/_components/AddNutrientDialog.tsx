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
import { CreateFoodNutrientRequestModel } from "../_models/createFoodNutrientRequestModel";
import SelectNutrient from "@/components/forms/SelectNutrient";

interface Props {
  handleAddNutrient: () => void;
  newNutrient: CreateFoodNutrientRequestModel;
  setNewNutrient: (newNutrient: CreateFoodNutrientRequestModel) => void;
}

export const AddNutrientDialog = ({
  handleAddNutrient,
  newNutrient,
  setNewNutrient,
}: Props) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const submit = () => {
    handleAddNutrient();
    handleClose();
  };
  return (
    <>
      <Button startIcon={<AddCircleOutlineIcon />} onClick={handleOpen}>
        Add Nutrient
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Nutrient</DialogTitle>
        <DialogContent>
          <SelectNutrient
            onSelectedNutrientChange={(selectedNutrient) => {
              selectedNutrient &&
                setNewNutrient({
                  ...newNutrient,
                  nutrientId: selectedNutrient.id,
                });
            }}
            onNutrientAmountChange={(newAmount, newUnit) => {
              setNewNutrient({
                ...newNutrient,
                amount: newAmount ?? 0,
                unitId: newUnit?.id ?? 0,
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
