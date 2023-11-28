'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { useGetRecipeByIdQuery } from '../../recipeHooks';
import { Box, Button, Grid, TextField } from '@mui/material';
import TagInput from '@/components/forms/TagInput'
import toast from 'react-hot-toast'
import { EditRecipeRequestModel } from '../_models/EditRecipeRequestModel';
import { useGetUnitsQuery } from '@/app/(authorized)/food/foodHooks';
import { SelectNutrientWithUnitState, ServingSizeUnitField } from '../../create/_components/ServingSizeUnitField';
import { EditRecipeFoodItem } from './EditRecipeFoodItem';

interface EditRecipeFormProps {
  recipeId: string;
}

export const EditRecipeForm = ({ recipeId }: EditRecipeFormProps) => {
  const { data: recipe, isLoading, isFetching } = useGetRecipeByIdQuery(recipeId);
  const { data: unitOptions } = useGetUnitsQuery();

  const [editRecipeFormState, setEditRecipeForm] = React.useState<EditRecipeRequestModel>({
    id: '',
    description: recipe?.description,
    tags: recipe?.tags.split(','),
    notes: recipe?.notes,
    recipeFoods: recipe?.recipeFoods.map(rf => {
      return {
        id: rf.foodId,
        servingSize: rf.amount,
        unitId: rf.unitId,
        unitName: rf.unitName,
        name: rf.name,
        unit: unitOptions?.find(u => u.id === rf.unitId) || null,
      }
    }) || [],
    amount: recipe?.amount,
    servingsUnit: unitOptions?.find(u => u.id === recipe?.servingsSizeUnitId) || undefined,
    servingSizeUnitId: recipe?.servingsSizeUnitId,
  });

  const [isValid, setIsValid] = useState<boolean>(false);
  const [recipeFoodsAreValid, setFoodRecipesAreValid] = useState<boolean>(false);

  const handleSubmit = () => {
    if (!isValid) {
      toast.error("Invalid Form");
    } else {
      toast.success("Form Submitted");
      console.log(editRecipeFormState);
    }
  }

  const handleSelectServingSizeUpdate = ({ servingSize, servingSizeUnit, servingSizeUnitId }: SelectNutrientWithUnitState) => {
    setEditRecipeForm({
      ...editRecipeFormState,
      amount: servingSize,
      servingsUnit: servingSizeUnit,
      servingSizeUnitId,
    });
  }

  const validateForm = () => {
    const validateServing = () => {
      const isValid = editRecipeFormState?.amount
        && editRecipeFormState?.amount > 0
        && editRecipeFormState.amount != null
        && editRecipeFormState.amount != undefined
      setServingSizeIsValid(isValid || false);
      return isValid;

    }
    const validateFoods = () => {

      const isValid = editRecipeFormState?.recipeFoods?.every(n => n.servingSize > 0) && editRecipeFormState.recipeFoods.length > 0;
      setFoodRecipesAreValid(isValid || false);
      return isValid;

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
    setEditRecipeForm({
      id: recipe?.id || '',
      description: recipe?.description,
      tags: recipe?.tags.split(','),
      notes: recipe?.notes,
      recipeFoods: recipe?.recipeFoods.map(rf => {
        return {
          id: rf.foodId,
          servingSize: rf.amount,
          unitId: rf.unitId,
          unitName: rf.unitName,
          name: rf.food.description,
          unit: unitOptions?.find(u => u.id === rf.unitId) || null,
        }
      }) || [],
      amount: recipe?.amount,
      servingsUnit: unitOptions?.find(u => u.id === recipe?.servingsSizeUnitId) || undefined,
      servingSizeUnitId: recipe?.servingsSizeUnitId,
    })
  }
  return (
    <Box>
      <Grid container spacing={2}>
        {/* Submit Button at the top right */}
        <Grid item xs={12} container justifyContent="flex-end">
          <Button variant="contained" onClick={handleSubmit}>Submit</Button>
        </Grid>
        {/* Description and Brand */}
        <Grid item xs={12} sm={6}>
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
          />
        </Grid>
        {/* Ingredients Tag Input */}
        <Grid item xs={12}>
          <TagInput
            tags={editRecipeFormState?.tags || []}
            setTags={(tags) => {
              setEditRecipeForm({
                ...editRecipeFormState,
                tags,
              });
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          {/* Assuming ServingSizeUnitField internally handles size and unit on the same line */}
          <ServingSizeUnitField
            formState={{
              servingSize: editRecipeFormState.amount,
              servingSizeUnit: editRecipeFormState.servingsUnit,
              servingSizeUnitId: editRecipeFormState.servingSizeUnitId,
            }}
            setFormState={handleSelectServingSizeUpdate}
            formValid={servingSizeIsValid}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <TextField
            fullWidth
            label="Notes"
            variant="outlined"
            multiline
            rows={4}
            value={editRecipeFormState?.notes}
            onChange={(e) => {
              setEditRecipeForm({
                ...editRecipeFormState,
                note: e.target.value,
              });
            }}
          />
        </Grid>
        <Grid>
          {
            editRecipeFormState?.recipeFoods?.map((food, index) => {
              return (
                <Grid item xs={12} key={index}>
                  <EditRecipeFoodItem food={food} deleteFood={() => handleFoodDelete(food.id)} updateFood={(foodAmount: number) => handleFoodUpdate(food.id, foodAmount)}
                    inputOptions={
                      {
                        helperText: "Invalid Food Amount",
                        error: !recipeFoodsAreValid,
                      }
                    } />
                </Grid>
              )
            }
            )}
        </Grid>
      </Grid>
    </Box>
  );
}
