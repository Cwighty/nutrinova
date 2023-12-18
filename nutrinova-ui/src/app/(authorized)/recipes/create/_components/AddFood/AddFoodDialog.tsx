"use client";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Step,
  StepLabel,
  Stepper,
} from "@mui/material";
import React, { useState } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { CreateRecipeFoodModel } from "../../_models/createRecipeFoodModel";
import { SelectFoodStep } from "./SelectFoodStep";
import { SelectAmountStep } from "./SelectAmountStep";

interface Props {
  handleAddFood: () => void;
  newFood: CreateRecipeFoodModel;
  setNewFood: (newFood: CreateRecipeFoodModel) => void;
}

export const AddFoodDialog = ({
  handleAddFood,
  newFood,
  setNewFood,
}: Props) => {
  const [open, setOpen] = useState(false);

  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Select a Food', 'Select an Amount'];

  const [validFoodSelected, setValidFoodSelected] = useState<boolean>(true);
  const [servingsPerMeasurementRequired, setServingsPerMeasurementRequired] = useState<boolean>(false);

  const nextStepDisabled = (
    (activeStep == 0 && newFood.foodId == "")
    || (activeStep == 1 && servingsPerMeasurementRequired && (newFood.foodServingsPerMeasurement === null || newFood.foodServingsPerMeasurement <= 0))
    || (activeStep == 1 && newFood.measurement <= 0)
  )

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewFood({
      foodId: "",
      measurement: 1,
      measurementUnitId: 1,
      name: "",
      measurementUnitName: "Gram",
      foodServingsPerMeasurement: null,
    });
    setValidFoodSelected(true);
    setActiveStep(0)
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      submit();
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const submit = () => {
    if (newFood.measurement <= 0) {
      return;
    }
    if (newFood.foodId === "") {
      setValidFoodSelected(false);
      return;
    }
    if (newFood.measurementUnitId === 0) {
      return;
    }
    if (servingsPerMeasurementRequired && (newFood.foodServingsPerMeasurement === null || newFood.foodServingsPerMeasurement <= 0)) {
      return;
    }
    handleAddFood();
    handleClose();
  };

  return (
    <>
      <Button startIcon={<AddCircleOutlineIcon />} onClick={handleOpen}>
        Add Food
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Food</DialogTitle>
        <DialogContent>

          {/* STEP 1 */}
          {activeStep === 0 && (
            <SelectFoodStep
              setNewFood={setNewFood}
              validFoodSelected={validFoodSelected}
              newFood={newFood} />
          )}

          {/* STEP 2 */}
          {activeStep === 1 && (
            <SelectAmountStep
              newFood={newFood}
              setNewFood={setNewFood}
              setConversionRateRequired={setServingsPerMeasurementRequired} />
          )}

          <Box sx={{ mt: 2 }}>
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 2 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          {activeStep !== 0 && (
            <Button onClick={handleBack}>
              Back
            </Button>
          )}
          <Button onClick={handleNext} color="primary" disabled={nextStepDisabled}>
            {activeStep === steps.length - 1 ? 'Add' : 'Next'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
