"use client";
import React, { useState } from "react";
import {
  Button,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Grid,
  Paper,
  Alert,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { CreateFoodNutrientRequestModel } from "../_models/createFoodNutrientRequestModel";
import { CreateFoodRequestModel } from "../_models/createFoodRequest";
import { AddNutrientDialog } from "./AddNutrientDialog";
import {
  useCreateFoodMutation,
  useGetNutrientsQuery,
  useGetUnitsQuery,
} from "../../foodHooks";
import SelectUnit from "@/components/forms/SelectUnit";

const initialNutrient: CreateFoodNutrientRequestModel = {
  nutrientId: 0,
  amount: 0,
  unitId: 0,
  nutrientName: "",
  unitCategoryId: 0,
};

export default function CreateFoodForm() {
  const [foodFormState, setFoodFormState] = useState<CreateFoodRequestModel>({
    description: "",
    servingSize: undefined,
    unit: 0,
    note: "",
    foodNutrients: [],
  });

  const [newNutrient, setNewNutrient] =
    useState<CreateFoodNutrientRequestModel>({ ...initialNutrient });

  const { data: nutrientOptions } = useGetNutrientsQuery();
  const { data: unitOptions } = useGetUnitsQuery();

  const createFoodMutation = useCreateFoodMutation();

  const [formValid, setFormValid] = useState<boolean>(true);

  const handleAddNutrient = () => {
    setFoodFormState({
      ...foodFormState,
      foodNutrients: [...foodFormState.foodNutrients, newNutrient],
    });
    setNewNutrient({ ...initialNutrient });
  };

  const handleRemoveNutrient = (index: number) => {
    const updatedNutrients = [...foodFormState.foodNutrients];
    updatedNutrients.splice(index, 1);
    setFoodFormState({ ...foodFormState, foodNutrients: updatedNutrients });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) {
      setFormValid(false);
      return;
    }
    setFormValid(true);
    createFoodMutation.mutate(foodFormState, {
      onSuccess: () => {
        setFoodFormState({
          description: "",
          servingSize: undefined,
          unit: 1,
          note: "",
          foodNutrients: [],
        });
      },
    });
  };

  const validateForm = () => {
    if (foodFormState.foodNutrients.length === 0) {
      return false;
    }
    if (foodFormState.description === "") {
      return false;
    }
    if (foodFormState.servingSize == undefined) {
      return false;
    }
    if (foodFormState.servingSize <= 0) {
      return false;
    }
    if (foodFormState.unit === 0) {
      return false;
    }
    return true;
  };

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Food Name */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Food Name"
              value={foodFormState.description}
              onChange={(e) =>
                setFoodFormState({
                  ...foodFormState,
                  description: e.target.value,
                })
              }
              fullWidth
              error={!formValid && foodFormState.description === ""}
              helperText={
                !formValid && foodFormState.description === ""
                  ? "Please enter a food name"
                  : ""
              }
            />
          </Grid>

          {/* Serving Size */}
          <Grid item xs={12} md={3}>
            <TextField
              label="Serving Size"
              type="number"
              value={foodFormState.servingSize ?? ""}
              onChange={(e) =>
                setFoodFormState({
                  ...foodFormState,
                  servingSize: Number(e.target.value),
                })
              }
              fullWidth
              error={
                !formValid &&
                (foodFormState.servingSize == undefined ||
                  foodFormState.servingSize <= 0)
              }
              helperText={
                !formValid &&
                (foodFormState.servingSize == undefined ||
                  foodFormState.servingSize <= 0)
                  ? "Please enter a valid serving size"
                  : ""
              }
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <SelectUnit
              value={
                unitOptions?.find((u) => u.id === foodFormState.unit) ?? null
              }
              onSelectedUnitChange={(unit) =>
                setFoodFormState({ ...foodFormState, unit: unit?.id ?? 0 })
              }
              error={!formValid && foodFormState.unit === undefined}
              helperText={
                !formValid && foodFormState.unit === undefined
                  ? "A unit must be supplied with a serving size"
                  : ""
              }
            />
          </Grid>

          {/* Note */}
          <Grid item xs={12} height={170}>
            <TextField
              label="Note"
              multiline
              rows={4}
              value={foodFormState.note}
              onChange={(e) =>
                setFoodFormState({ ...foodFormState, note: e.target.value })
              }
              fullWidth
            />
          </Grid>
        </Grid>

        <List>
          <Box>
            <AddNutrientDialog
              newNutrient={newNutrient}
              setNewNutrient={setNewNutrient}
              handleAddNutrient={handleAddNutrient}
            />
          </Box>
          {foodFormState.foodNutrients.length === 0 && (
            <Alert severity="warning">Please add at least one nutrient</Alert>
          )}
          {foodFormState.foodNutrients.map((nutrient, index) => (
            <ListItem key={index} divider>
              <ListItemText
                primary={
                  nutrientOptions?.find((n) => n.id === nutrient.nutrientId)
                    ?.description
                }
                secondary={`${nutrient.amount} ${unitOptions?.find(
                  (u) => u.id === nutrient.unitId,
                )?.description}`}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleRemoveNutrient(index)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
        <Box display="flex" justifyContent="flex-end">
          <Button type="submit" variant="contained" color="primary">
            Create
          </Button>
        </Box>
      </form>
    </Paper>
  );
}
