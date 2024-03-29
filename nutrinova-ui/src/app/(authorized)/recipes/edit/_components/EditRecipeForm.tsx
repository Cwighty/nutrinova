"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  useEditRecipeMutation,
  useGetRecipeByIdQuery,
} from "../../recipeHooks";
import { Alert, Box, Button, Grid, TextField } from "@mui/material";
import TagInput from "@/components/forms/TagInput";
import toast from "react-hot-toast";
import { EditRecipeRequestModel } from "../_models/EditRecipeRequestModel";
import { useGetUnitsQuery } from "@/app/(authorized)/food/foodHooks";
import {
  SelectNutrientWithUnitState,
  ServingSizeUnitField,
} from "../../create/_components/ServingSizeUnitField";
import { EditRecipeFoodItem } from "./EditRecipeFoodItem";
import { AddFoodDialog } from "../../create/_components/AddFood/AddFoodDialog";
import { CreateRecipeFoodModel } from "../../create/_models/createRecipeFoodModel";

interface EditRecipeFormProps {
  recipeId: string;
}

export const EditRecipeForm = ({ recipeId }: EditRecipeFormProps) => {
  const {
    data: recipe,
    isLoading,
    isFetching,
  } = useGetRecipeByIdQuery(recipeId);
  const { data: unitOptions } = useGetUnitsQuery();
  const editRecipeMutation = useEditRecipeMutation(recipeId);

  const [editRecipeFormState, setEditRecipeForm] = React.useState<EditRecipeRequestModel>({
    id: '',
    description: recipe?.description,
    tags: (recipe?.tags !== undefined && recipe?.tags !== null && recipe?.tags.length !== 0) ? recipe?.tags?.split(',') : [],
    notes: recipe?.notes,
    recipeFoods: recipe?.recipeFoods.map(rf => {
      return {
        id: rf.id,
        servingSize: rf.servingSize,
        unitId: rf.unitId,
        description: rf.description,
        unit: rf.unit,
        unitName: rf?.unit?.description || "",
        name: rf.description,
      }
    }) || [],
    amount: recipe?.amount,
    servingsUnit: recipe?.unit,
    unitId: recipe?.servingsSizeUnit,
    categoryId: recipe?.unit?.categoryId || 0,
  });

  const initialFood: CreateRecipeFoodModel = {
    foodId: "",
    measurement: 1,
    measurementUnitId: 1,
    name: "",
    measurementUnitName: "Gram",
    foodServingsPerMeasurement: null,
  };

  const [newFood, setNewFood] = useState<CreateRecipeFoodModel>({
    ...initialFood,
  });

  const handleAddFood = () => {
    setEditRecipeForm({
      ...editRecipeFormState,
      recipeFoods: [
        ...editRecipeFormState.recipeFoods,
        {
          id: newFood.foodId,
          servingSize: newFood.measurement,
          unitId: newFood.measurementUnitId,
          unitName: newFood.measurementUnitName,
          name: newFood.name,
          unit: unitOptions?.find((u) => u.id === newFood.measurementUnitId),
        },
      ],
    });
    setNewFood({ ...initialFood });
  };

  const [isValid, setIsValid] = useState<boolean>(false);
  const [recipeFoodsAreValid, setFoodRecipesAreValid] = useState<boolean>(false);
  const [descriptionIsValid, setDescriptionIsValid] = useState<boolean>(false);

  const handleSubmit = () => {
    if (!isValid) {
      toast.error("Invalid Form");
    } else {
      toast.success("Form Submitted");
      editRecipeMutation.mutate(editRecipeFormState, {
        onSuccess: () => {
          toast.success("Recipe Updated");
        },
      });
    }
  };

  const handleSelectServingSizeUpdate = ({ servingSize, servingSizeUnit }: SelectNutrientWithUnitState) => {
    setEditRecipeForm({
      ...editRecipeFormState,
      amount: servingSize,
      servingsUnit: servingSizeUnit,
      unitId: servingSizeUnit?.id,
    });
  };

  const validateForm = () => {

    const validateServing = () => {
      const isValidServing = (editRecipeFormState.amount !== null
        && editRecipeFormState.amount !== undefined
        && editRecipeFormState?.amount > 0
        && editRecipeFormState?.unitId !== undefined
        && editRecipeFormState?.unitId > -1)
      setServingSizeIsValid(isValidServing);
      return isValidServing;
    };
    const validateFoods = () => {

      const isValidFood = editRecipeFormState.recipeFoods.length > 0 && editRecipeFormState?.recipeFoods?.every(n => n.servingSize > 0);
      setFoodRecipesAreValid(isValidFood);
      return isValidFood;
    }

    const validateDescription = () => {
      const isValidDescription = (editRecipeFormState.description !== undefined && editRecipeFormState.description !== "" && editRecipeFormState.description !== null);
      setDescriptionIsValid(isValidDescription);
      return isValidDescription;
    }

    return validateServing() && validateFoods() && validateDescription();
  }

  const handleFoodUpdate = (foodId: string, foodAmount: number) => {
    const newRecipeFoods = editRecipeFormState.recipeFoods.map((rf) => {
      if (rf.id === foodId) {
        return {
          ...rf,
          servingSize: foodAmount,
        };
      }
      return rf;
    });
    setEditRecipeForm({
      ...editRecipeFormState,
      recipeFoods: newRecipeFoods,
    });
  };

  const handleFoodDelete = (foodId: string) => {
    const newRecipeFoods = editRecipeFormState.recipeFoods.filter(
      (rf) => rf.id !== foodId,
    );
    setEditRecipeForm({
      ...editRecipeFormState,
      recipeFoods: newRecipeFoods,
    });
  };

  const [servingSizeIsValid, setServingSizeIsValid] = useState<boolean>(false);

  const validateFormCallback = useCallback(validateForm, [editRecipeFormState]);

  useEffect(() => {
    setIsValid(() => validateFormCallback());
  }, [editRecipeFormState, validateFormCallback])

  if (isLoading || isFetching) {
    return <div>Loading...</div>;
  }

  if (recipe?.id !== editRecipeFormState?.id) {
    setEditRecipeForm(() => {
      return {
        id: recipe?.id || "",
        description: recipe?.description,
        tags: (recipe?.tags && recipe.tags !== '') ? recipe.tags.split(',') : [],
        notes: recipe?.notes || '',
        recipeFoods: recipe?.recipeFoods.map(rf => {
          return {
            id: rf.id,
            servingSize: rf.servingSize,
            unitId: rf.unitId,
            description: rf.description,
            unit: rf.unit,
            unitName: rf.unit?.description || "",
            name: rf.description,
            servingSizeUnit: rf.servingSizeUnit
          }
        }) || [],
        amount: recipe?.amount,
        servingsUnit: recipe?.unit,
        unitId: recipe?.unit?.id,
        categoryId: recipe?.unit?.categoryId || 0,
      };
    });
  }
  return (
    <Box sx={{ flexGrow: 1, padding: 3 }}>
      <Grid container spacing={2} padding={2}>
        <Grid container spacing={2}>
          <Grid item xs={12} justifyContent="flex-start">
            <TextField
              fullWidth
              label="Description/Name"
              variant="outlined"
              value={editRecipeFormState.description}
              onChange={(e) => {
                setEditRecipeForm({
                  ...editRecipeFormState,
                  description: e.target.value ?? "",
                });
              }}
              error={!descriptionIsValid}
              helperText={!descriptionIsValid ? "Please enter a description" : ""}
              sx={{ marginBottom: 2 }} // Adding space below each input
            />
            <Box>
              <TagInput
                tags={editRecipeFormState?.tags || []}
                setTags={(tags) => {
                  setEditRecipeForm({
                    ...editRecipeFormState,
                    tags,
                  });
                }}
                tagLabel="Tags"
              />
            </Box>
          </Grid>
          <ServingSizeUnitField
            formState={{
              servingSize: editRecipeFormState.amount,
              servingSizeUnit: editRecipeFormState.servingsUnit,
              servingSizeUnitId: editRecipeFormState.unitId,
            }}
            setFormState={handleSelectServingSizeUpdate}
            formValid={servingSizeIsValid}
          />
          <Grid item xs={12} sx={{ paddingBottom: 2 }}>
            <TextField
              fullWidth
              label="Notes"
              variant="outlined"
              multiline
              rows={10}
              value={editRecipeFormState?.notes}
              onChange={(e) => {
                setEditRecipeForm({
                  ...editRecipeFormState,
                  notes: e.target.value,
                });
              }}
              sx={{ marginBottom: 2 }}
            />
          </Grid>
          <Grid item sx={{ marginBottom: 2 }} xs={12} justifyContent="center" padding={2}>
            <AddFoodDialog
              newFood={newFood}
              setNewFood={setNewFood}
              handleAddFood={handleAddFood}
            />
            {editRecipeFormState.recipeFoods.length > 0 ? (editRecipeFormState?.recipeFoods?.map((food) => (
              <Box sx={{ marginBottom: 1 }} key={food.id}>
                <EditRecipeFoodItem
                  food={food}
                  deleteFood={() => handleFoodDelete(food.id)}
                  updateFood={(foodAmount: number) =>
                    handleFoodUpdate(food.id, foodAmount)
                  }
                  inputOptions={{
                    helperText: "Invalid Food Amount",
                    error: !recipeFoodsAreValid,
                  }}
                />
              </Box>
            ))) :
              (<Alert severity="warning">Please add at least one food</Alert>)
            }
          </Grid>
          <Grid item xs={12} container justifyContent="flex-end">
            <Button variant="contained" onClick={handleSubmit} disabled={!isValid}>Save</Button>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};
