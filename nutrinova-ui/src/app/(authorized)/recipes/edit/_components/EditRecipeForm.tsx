'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { useEditRecipeMutation, useGetRecipeByIdQuery } from '../../recipeHooks';
import { Box, Button, Grid, TextField } from '@mui/material';
import TagInput from '@/components/forms/TagInput'
import toast from 'react-hot-toast'
import { EditRecipeRequestModel } from '../_models/EditRecipeRequestModel';
import { useGetUnitsQuery } from '@/app/(authorized)/food/foodHooks';
import { SelectNutrientWithUnitState, ServingSizeUnitField } from '../../create/_components/ServingSizeUnitField';
import { EditRecipeFoodItem } from './EditRecipeFoodItem';
import { AddFoodDialog } from '../../create/_components/AddFood/AddFoodDialog';
import { CreateRecipeFoodModel } from '../../create/_models/createRecipeFoodModel';

interface EditRecipeFormProps {
  recipeId: string;
}

export const EditRecipeForm = ({ recipeId }: EditRecipeFormProps) => {
  const { data: recipe, isLoading, isFetching } = useGetRecipeByIdQuery(recipeId);
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
      recipeFoods: [...editRecipeFormState.recipeFoods, {
        id: newFood.foodId,
        servingSize: newFood.measurement,
        unitId: newFood.measurementUnitId,
        unitName: newFood.measurementUnitName,
        name: newFood.name,
        unit: unitOptions?.find(u => u.id === newFood.measurementUnitId),
      }],
    });
    setNewFood({ ...initialFood });
  };

  const [isValid, setIsValid] = useState<boolean>(false);
  const [recipeFoodsAreValid, setFoodRecipesAreValid] = useState<boolean>(false);

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
  }

  const handleSelectServingSizeUpdate = ({ servingSize, servingSizeUnit, servingSizeUnitId }: SelectNutrientWithUnitState) => {
    setEditRecipeForm({
      ...editRecipeFormState,
      amount: servingSize,
      servingsUnit: servingSizeUnit,
      unitId: servingSizeUnitId,
    });
  }

  const validateForm = () => {
    const validateServing = () => {
      const isValidServing = editRecipeFormState?.amount
        && editRecipeFormState?.amount > 0
        && editRecipeFormState.amount !== null
        && editRecipeFormState.amount !== undefined
        && editRecipeFormState?.unitId !== undefined
        && editRecipeFormState?.unitId > -1
      setServingSizeIsValid(isValidServing || false);
      return isValidServing;
    }
    const validateFoods = () => {

      const isValidFood = editRecipeFormState?.recipeFoods?.every(n => n.servingSize > 0) && editRecipeFormState.recipeFoods.length > 0;
      setFoodRecipesAreValid(isValidFood || false);
      return isValidFood;

    }
    return validateServing() && validateFoods();
  }

  const handleFoodUpdate = (foodId: string, foodAmount: number) => {
    const newRecipeFoods = editRecipeFormState.recipeFoods.map(rf => {
      if (rf.id === foodId) {
        return {
          ...rf,
          servingSize: foodAmount,
        }
      }
      return rf;
    })
    setEditRecipeForm({
      ...editRecipeFormState,
      recipeFoods: newRecipeFoods,
    })
  }

  const handleFoodDelete = (foodId: string) => {
    const newRecipeFoods = editRecipeFormState.recipeFoods.filter(rf => rf.id !== foodId);
    setEditRecipeForm({
      ...editRecipeFormState,
      recipeFoods: newRecipeFoods,
    })
  }

  const [servingSizeIsValid, setServingSizeIsValid] = useState<boolean>(false);

  const validateFormCallback = useCallback(validateForm, [editRecipeFormState]);

  useEffect(() => {
    setIsValid(validateFormCallback() || false);
  }, [editRecipeFormState, validateFormCallback])

  if (isLoading || isFetching) {
    return <div>Loading...</div>
  }

  if (recipe?.id !== editRecipeFormState?.id) {
    setEditRecipeForm(() => {
      return {
        id: recipe?.id || '',
        description: recipe?.description,
        tags: recipe?.tags?.split(','),
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
      }
    })
  }
  return (
    <Box sx={{ flexGrow: 1, padding: 3 }}>
      <Grid container spacing={2} padding={2} >
        {/* Main Form - Responsive Layout */}
        <Grid container spacing={2} >
          {/* Left Column (becomes full width on smaller screens) */}
          <Grid item xs={12} md={5} sx={{ paddingBottom: 2 }} justifyContent="flex-start">
            <TextField
              fullWidth
              label="Description/Name"
              variant="outlined"
              value={editRecipeFormState.description}
              onChange={(e) => {
                setEditRecipeForm({
                  ...editRecipeFormState,
                  description: e.target.value,
                });
              }}
              sx={{ marginBottom: 2 }} // Adding space below each input
            />
            <Box sx={{ marginBottom: 2 }}>
              <TagInput
                tags={editRecipeFormState?.tags || []}
                setTags={(tags) => {
                  setEditRecipeForm({
                    ...editRecipeFormState,
                    tags,
                  });
                }}
                tagLabel='Tags'
              />
            </Box>
            <ServingSizeUnitField
              formState={{
                servingSize: editRecipeFormState.amount,
                servingSizeUnit: editRecipeFormState.servingsUnit,
                servingSizeUnitId: editRecipeFormState.unitId,
              }}
              setFormState={handleSelectServingSizeUpdate}
              formValid={servingSizeIsValid}
            />
          </Grid>

          {/* Right Column (becomes full width on smaller screens) */}
          <Grid item xs={12} md={7} sx={{ paddingBottom: 2 }}>
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
          <Grid sx={{ marginBottom: 2 }} xs={12} justifyContent="center" padding={2}>
            <AddFoodDialog
              newFood={newFood}
              setNewFood={setNewFood}
              handleAddFood={handleAddFood}
            />
            {editRecipeFormState?.recipeFoods?.map((food) => (
              <Box sx={{ marginBottom: 1 }} key={food.id}>
                <EditRecipeFoodItem
                  food={food}
                  deleteFood={() => handleFoodDelete(food.id)}
                  updateFood={(foodAmount: number) => handleFoodUpdate(food.id, foodAmount)}
                  inputOptions={{
                    helperText: "Invalid Food Amount",
                    error: !recipeFoodsAreValid,
                  }}
                />
              </Box>
            ))}
          </Grid>
          <Grid item xs={12} container justifyContent="flex-end">
            <Button variant="contained" onClick={handleSubmit}>Save</Button>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
