"use client";
import React, { useState } from "react";
import { Button, TextField, Grid, Paper, Box } from "@mui/material";
import { useCreateRecipeMutation } from "../../recipeHooks";
import TagInput from "@/components/forms/TagInput";
import { CreateRecipeRequestModel } from "../_models/createRecipeRequest";
import { NutrientTotalsSummary } from "./NutrientTotalsSummary";
import {
  SelectNutrientWithUnitState,
  ServingSizeUnitField,
} from "./ServingSizeUnitField";
import { RecipeFoodList } from "./RecipeFoodList";

export default function CreateRecipeForm() {
  const [recipeFormState, setRecipeFormState] =
    useState<CreateRecipeRequestModel>({
      description: "",
      notes: "",
      tags: [],
      recipeFoods: [],
    });

  const createRecipeMutation = useCreateRecipeMutation();

  const [formValid, setFormValid] = useState<boolean>(true);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) {
      setFormValid(false);
      return;
    }
    setFormValid(true);
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
    if (recipeFormState.servingSize === undefined) {
      return false;
    }
    if (recipeFormState.servingSize <= 0) {
      return false;
    }

    return true;
  };

  const handleSelectNutrientUpdate = ({
    servingSize,
    servingSizeUnit,
    servingSizeUnitId,
  }: SelectNutrientWithUnitState) => {
    setRecipeFormState({
      ...recipeFormState,
      servingSize: servingSize,
      servingSizeUnit,
      servingSizeUnitId,
    });
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
              setTags={(tags) =>
                setRecipeFormState({ ...recipeFormState, tags })
              }
            />
          </Grid>

          <ServingSizeUnitField
            formState={recipeFormState}
            setFormState={handleSelectNutrientUpdate}
            formValid={formValid}
          />

          {/* Notes */}
          <Grid item xs={12} height={170}>
            <TextField
              label="Note"
              multiline
              rows={4}
              value={recipeFormState.notes}
              onChange={(e) =>
                setRecipeFormState({
                  ...recipeFormState,
                  notes: e.target.value,
                })
              }
              fullWidth
            />
          </Grid>

          {/* Macro Nutrient Summary */}
          <Grid item xs={12}>
            <NutrientTotalsSummary recipeFoods={recipeFormState.recipeFoods} />
          </Grid>
        </Grid>

        <RecipeFoodList
          recipeFormState={recipeFormState}
          setRecipeFormState={setRecipeFormState}
        />

        <Box display="flex" justifyContent="flex-end">
          <Button type="submit" variant="contained" color="primary">
            Create
          </Button>
        </Box>
      </form>
    </Paper>
  );
}
