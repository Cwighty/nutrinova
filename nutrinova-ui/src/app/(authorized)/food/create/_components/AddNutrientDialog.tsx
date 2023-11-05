'use client'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, } from '@mui/material';
import React, { useState } from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { CreateFoodNutrientRequestModel } from '../_models/createFoodNutrientRequestModel';
import SelectNutrient from '@/components/forms/SelectNutrient';

interface Props {
  handleAddNutrient: () => void;
  newNutrient: CreateFoodNutrientRequestModel;
  setNewNutrient: (newNutrient: CreateFoodNutrientRequestModel) => void;
}

export const AddNutrientDialog = ({ handleAddNutrient, newNutrient, setNewNutrient }: Props) => {
  const [open, setOpen] = useState(false);
  const [isFormError, setIsFormError] = useState(false);
  // Implement your component logic here
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleNewNutrientChange = (field: keyof CreateFoodNutrientRequestModel, value: string | number) => {
    setNewNutrient({ ...newNutrient, [field]: value });
  };

  const validateAndSubmit = () => {

    if (!newNutrient.nutrientId || newNutrient.amount <= 0 || !newNutrient.unitId) {
      setIsFormError(true);
    }
    else {
      setIsFormError(false);
    }
    if (isFormError) {
      return;
    }

    handleAddNutrient();
    handleClose();
  }
  return (
    <>
      <Button
        startIcon={<AddCircleOutlineIcon />}
        onClick={handleOpen}
      >
        Add Nutrient
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Nutrient</DialogTitle>
        <DialogContent>
          <SelectNutrient
            error={isFormError}
            onSelectedNutrientChange={(selectedNutrient) => { selectedNutrient && handleNewNutrientChange('nutrientId', selectedNutrient.id) }}
            onNutrientAmountChange={(newAmount, newUnit) => {
              handleNewNutrientChange('amount', newAmount ?? 0);
              handleNewNutrientChange('unitId', newUnit?.id ?? 0);
            }
            } />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={() => { validateAndSubmit(); }
          } color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

