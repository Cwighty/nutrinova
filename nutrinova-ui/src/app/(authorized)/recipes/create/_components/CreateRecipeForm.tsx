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
import { useCreateRecipeMutation } from "../../recipeHooks";

// const initialFood: CreateRecipeFoodRequest = {
//   foodId: 0,
//   amount: 0,
//   unitId: 1,
// };

export default function CreateRecipeForm() {
  const [recipeFormState, setRecipeFormState] = useState<CreateRecipeRequest>({
    description: "",
    notes: "",
    recipeFoods: [],
  });

  // const [newFood, setNewFood] =
  //   useState<CreateRecipeFoodRequest>({ ...initialFood });

  const createRecipeMutation = useCreateRecipeMutation();

  const [formValid, setFormValid] = useState<boolean>(true);

  // const handleAddFood = () => {
  //   setRecipeFormState({
  //     ...recipeFormState,
  //     recipeFoods: [...recipeFormState.recipeFoods, newFood],
  //   });
  //   setNewFood({ ...initialFood });
  // };

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
            {/* <AddFoodDialog
              newFood={newFood}
              setNewFood={setNewFood}
              handleAddFood={handleAddFood}
            /> */}
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
