"use client";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Link,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { MyFoodSearchForm } from "@/app/(authorized)/food/view/_components/MyFoodsSearchForm";
import { useDebounce } from "@uidotdev/usehooks";
import { SelectFoodDataGrid } from "@/components/forms/SelectFoodDataGrid";
import { AmountInput } from "@/components/forms/AmountInput";
import { SearchParameters } from "@/app/(authorized)/food/view/page";
import { CreateRecipeFoodModel } from "../_models/createRecipeFoodModel";
import { useGetFoodByIdQuery, useGetUnitsQuery } from "@/app/(authorized)/food/foodHooks";
import { SelectedRecipeFoodCard } from "./SelectedFoodCard";

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
  const [searchParameters, setSearchParameters] = useState<SearchParameters>({
    nutrientSearchTerm: {
      id: 0,
      description: "",
      preferredUnitId: 0,
      categoryName: "",
    },
    foodSearchTerm: "",
    comparisonOperator: "gt",
    nutrientValue: 0,
  });
  const searchParameterDebounce = useDebounce(searchParameters, 500);
  const [validFoodSelected, setValidFoodSelected] = useState<boolean>(true);
  const [conversionRate, setConversionRate] = useState<number>(0);
  const { data: food } = useGetFoodByIdQuery(newFood.foodId);
  const { data: unitOptions } = useGetUnitsQuery();
  const newFoodUnit = unitOptions?.find(u => u.id == newFood.unitId)
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewFood({
      foodId: "",
      amount: 1,
      unitId: 1,
      name: "",
      unitName: "Gram",
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
    if (newFood.amount <= 0) {
      return;
    }
    if (newFood.foodId === "") {
      setValidFoodSelected(false);
      return;
    }
    if (newFood.unitId === 0) {
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
          {activeStep === 0 && (
            <Box sx={{ my: 2 }}>
              <MyFoodSearchForm
                modal
                setSearchParameters={setSearchParameters}
                currentSearchParameters={searchParameters}
              />
              <SelectFoodDataGrid
                searchQuery={searchParameterDebounce}
                onFoodSelected={(food) =>
                  setNewFood({
                    ...newFood,
                    foodId: food.id,
                    name: food.description,
                  })
                }
              />
              {validFoodSelected ? (
                ""
              ) : (
                <Typography fontSize={12} color="error">
                  Please select a food
                </Typography>
              )}
            </Box>
          )}
          {activeStep === 1 && (
            <>
              <Box sx={{ my: 2 }}>
                <SelectedRecipeFoodCard item={newFood} />
              </Box>
              <AmountInput
                amount={newFood.amount}
                setAmount={(amount) =>
                  setNewFood({
                    ...newFood,
                    amount: amount,
                  })
                }
                unit={{
                  id: newFood.unitId,
                  description: newFood.unitName,
                  abbreviation: "",
                  categoryId: newFood.unitId,
                  category: {
                    id: newFood.unitId,
                    description: "",
                  },
                }}
                setUnit={(unit) =>
                  setNewFood({
                    ...newFood,
                    unitId: unit.id,
                    unitName: unit.description,
                  })
                }
              />
              {food?.unit && newFoodUnit?.category.description !== food?.unit.category.description &&
                (
                  <Box sx={{ my: 2 }}>
                    <Typography>
                      This food&apos;s serving is measured in <b>{food?.unit.description}s</b>,
                      to add <b>{newFood.unitName}s</b> of this food to your recipe we need some information:
                    </Typography>
                    <Typography sx={{ mt: 2 }}>
                      {`How many ${food?.unit.description}s are in 1 ${newFood.unitName} of '${newFood.name}'?`}
                    </Typography>
                    <TextField
                      label={`${food?.unit.description}s in 1 ${newFood.unitName} of '${newFood.name}'`}
                      type="number"
                      value={conversionRate}
                      onChange={(e) => setConversionRate(Number(e.target.value))}
                      fullWidth
                      margin="normal"
                    />
                    <Typography>
                      Need help finding out?
                    </Typography>
                    <Link href={`https://www.google.com/search?q=how+many+${food?.unit.description}+in+1+${newFood.unitName}+of+${newFood.name}`} target="_blank">
                      Ask Google
                    </Link>
                    <br></br>
                    <Link href="chat.openai.com" target="_blank">
                      Ask Nova
                    </Link>
                  </Box>
                )}
            </>
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
          <Button onClick={handleNext} color="primary" disabled={newFood.foodId == ""}>
            {activeStep === steps.length - 1 ? 'Add' : 'Next'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
