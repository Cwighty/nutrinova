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
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useCreateRecipeMutation } from "../../recipeHooks";
import TagInput from "@/components/forms/TagInput";
import { AddFoodDialog } from "./AddFoodDialog";
import { CreateRecipeFoodModel } from "../_models/createRecipeFoodModel";
import { CreateRecipeRequestModel } from "../_models/createRecipeRequest";
import SelectUnit from "@/components/forms/SelectUnit";

const initialFood: CreateRecipeFoodModel = {
  foodId: "",
  amount: 1,
  unitId: 1,
  name: "",
  unitName: "Gram"
};

export default function CreateRecipeForm() {
  const [recipeFormState, setRecipeFormState] = useState<CreateRecipeRequestModel>({
    description: "",
    notes: "",
    tags: [],
    recipeFoods: [],
  });

  const [newFood, setNewFood] =
    useState<CreateRecipeFoodModel>({ ...initialFood });

  const createRecipeMutation = useCreateRecipeMutation();

  const [formValid, setFormValid] = useState<boolean>(true);

  const handleAddFood = () => {
    setRecipeFormState({
      ...recipeFormState,
      recipeFoods: [...recipeFormState.recipeFoods, newFood],
    });
    setNewFood({ ...initialFood });
  };

  const handleRemoveFood = (index: number) => {
    const updatedFoods = [...recipeFormState.recipeFoods];
    updatedFoods.splice(index, 1);
    setRecipeFormState({ ...recipeFormState, recipeFoods: updatedFoods });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) {
      setFormValid(false);
      return;
    }
    setFormValid(true);
    console.log(recipeFormState);
    createRecipeMutation.mutate(recipeFormState, {
      onSuccess: () => {
        setRecipeFormState({
          description: "",
          notes: "",
          tags: [],
          recipeFoods: [],
        });
      },
    });
  };

  const validateForm = () => {
    if (recipeFormState.recipeFoods.length === 0) {
      return false;
    }
    if (recipeFormState.description === "") {
      return false;
    }

    return true;
  };

  return (
    <Paper elevation={3} sx={{ padding: 2 }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Recipe Name */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Recipe Name"
              value={recipeFormState.description}
              onChange={(e) =>
                setRecipeFormState({
                  ...recipeFormState,
                  description: e.target.value,
                })
              }
              fullWidth
              margin="normal"
              error={!formValid && recipeFormState.description === ""}
              helperText={
                !formValid && recipeFormState.description === ""
                  ? "Please enter a recipe name"
                  : ""
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TagInput
              tags={recipeFormState.tags || []}
              setTags={(tags) => setRecipeFormState({ ...recipeFormState, tags })}
            />
          </Grid>

          {/* Serving Size */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Serving Size"
              type="number"
              value={recipeFormState.servingSize ?? ""}
              onChange={(e) =>
                setRecipeFormState({
                  ...recipeFormState,
                  servingSize: Number(e.target.value),
                })
              }
              fullWidth
              margin="normal"
              error={
                !formValid &&
                recipeFormState.servingSize !== undefined &&
                recipeFormState.servingSize <= 0
              }
              helperText={
                !formValid &&
                  recipeFormState.servingSize !== undefined &&
                  recipeFormState.servingSize <= 0
                  ? "Please enter a valid serving size"
                  : ""
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <SelectUnit
              value={recipeFormState.servingSizeUnit ? recipeFormState.servingSizeUnit : null}
              onSelectedUnitChange={(unit) =>
                setRecipeFormState({ ...recipeFormState, servingSizeUnit: unit, servingSizeUnitId: unit?.id ?? 0 })
              }
              error={
                !formValid &&
                recipeFormState.servingSize !== undefined &&
                recipeFormState.servingSizeUnit === undefined
              }
              helperText={
                !formValid && recipeFormState.servingSize
                  ? "A unit must be supplied with a serving size"
                  : ""
              }
            />
          </Grid>

          {/* Macro Nutrient Summary */}
          <Grid item xs={12}>
            <Typography variant="h6">Macro Nutrient Summary</Typography>
            <Typography variant="body2">No foods added</Typography>
          </Grid>

          {/* Notes */}
          <Grid item xs={12} height={170}>
            <TextField
              label="Note"
              multiline
              rows={4}
              value={recipeFormState.notes}
              onChange={(e) =>
                setRecipeFormState({ ...recipeFormState, notes: e.target.value })
              }
              fullWidth
              margin="normal"
            />
          </Grid>
        </Grid>

        <List>
          <Box>
            <AddFoodDialog
              newFood={newFood}
              setNewFood={setNewFood}
              handleAddFood={handleAddFood}
            />
          </Box>
          {recipeFormState.recipeFoods.length === 0 && (
            <Alert severity="warning">Please add at least one food</Alert>
          )}
          {recipeFormState.recipeFoods.map((food, index) => (
            <ListItem key={index} divider>
              <ListItemText
                primary={
                  food.name
                }
                secondary={`${food.amount} ${food.unitName}`}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleRemoveFood(index)}
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
