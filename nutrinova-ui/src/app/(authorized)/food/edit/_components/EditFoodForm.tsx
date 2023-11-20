"use client"
import { SelectNutrientWithUnitState, ServingSizeUnitField } from '@/app/(authorized)/recipes/create/_components/ServingSizeUnitField'
import TagInput from '@/components/forms/TagInput'
import { Box, Button, Grid, TextField } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import { EditFoodRequestModel } from '../_models/editFoodRequest'
import { useGetFoodByIdQuery, useGetUnitsQuery } from "../../foodHooks";
import { EditNutrientListItem } from './EditNutrientListItem'

interface Props {
  foodId: string
}

export const EditFoodForm = ({ foodId }: Props) => {



  const { data: food, isLoading: foodIsLoading } = useGetFoodByIdQuery(foodId);
  const { data: unitOptions } = useGetUnitsQuery();
  const [isValid, setIsValid] = useState<boolean>(false);

  const [editFoodFormState, setEditFoodForm] = React.useState<EditFoodRequestModel>({
    description: food?.description || '',
    brand: food?.brandName || '',
    ingredients: food?.ingredients?.split(',') || [],
    servingSize: food?.servingSize || 0,
    servingSizeUnit: unitOptions?.find(u => u.abreviation === food?.servingSizeUnit) || null,
    foodNutrients: food?.foodNutrients?.map(fn => {
      return {
        nutrientId: fn.nutrientId,
        amount: fn.value,
        unitId: fn.unitId,
        nutrientName: fn.nutrientName
      }
    }) || undefined,
    note: food?.note || '',
  })

  const validateform = () => {
    if (editFoodFormState.servingSize
      && editFoodFormState.servingSize > 0
      && editFoodFormState.servingSizeUnit) {
      return true;
    }
    return false;
  }
  const validateformCallback = useCallback(validateform, [editFoodFormState]);
  useEffect(() => {
    setIsValid(validateformCallback());
  }, [editFoodFormState, validateformCallback])


  if (foodIsLoading) {
    return <div>Loading...</div>
  }

  const handleNutrientAmountChange = (nutrientId: number, amount: number) => {
    if (editFoodFormState?.foodNutrients) {
      const updatedNutrientState = {
        ...editFoodFormState, foodNutrients: editFoodFormState?.foodNutrients.map(n => {
          if (n.nutrientId === nutrientId) {
            return {
              ...n,
              amount: amount
            }
          }
          return n;
        })
      };
      setEditFoodForm(updatedNutrientState);
    }
  }

  const handleSubmit = () => {
    console.log(editFoodFormState)
  }

  const handleNutrientDelete = (nutrientId: number) => {

    if (editFoodFormState?.foodNutrients) {

      const deletedNutrientState = {
        ...editFoodFormState, foodNutrients: editFoodFormState?.foodNutrients.filter(n => {
          return n.nutrientId != nutrientId;
        })
      };
      setEditFoodForm(deletedNutrientState);
    }
  }

  const handleSelectServingSizeUpdate = ({ servingSize, servingSizeUnit, servingSizeUnitId }: SelectNutrientWithUnitState) => {
    setEditFoodForm({
      ...editFoodFormState,
      servingSize,
      servingSizeUnit,
      servingSizeUnitId,
    });
  }

  return (
    <Box sx={{ width: '100%' }}>
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
            value={editFoodFormState.description}
            onChange={(e) => {
              setEditFoodForm({
                ...editFoodFormState,
                description: e.target.value,
              });
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Brand"
            variant="outlined"
            value={editFoodFormState.brand}
            onChange={(e) => {
              setEditFoodForm({
                ...editFoodFormState,
                brand: e.target.value,
              });
            }}
          />
        </Grid>
        {/* Ingredients Tag Input */}
        <Grid item xs={12}>
          <TagInput
            tags={editFoodFormState?.ingredients || []}
            setTags={(ingredients) => {
              setEditFoodForm({
                ...editFoodFormState,
                ingredients,
              });
            }}
          />
        </Grid>
        {/* Serving Size and Notes Side by Side */}
        <Grid item xs={12} md={4}>
          {/* Assuming ServingSizeUnitField internally handles size and unit on the same line */}
          <ServingSizeUnitField
            formState={editFoodFormState}
            setFormState={handleSelectServingSizeUpdate}
            formValid={isValid}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <TextField
            fullWidth
            label="Notes"
            variant="outlined"
            multiline
            rows={4}
            value={editFoodFormState.note}
            onChange={(e) => {
              setEditFoodForm({
                ...editFoodFormState,
                note: e.target.value,
              });
            }}
          />
        </Grid>
        {/* Nutrients */}
        <Grid item xs={12}>
          {editFoodFormState.foodNutrients?.map((fn, index) => (
            <EditNutrientListItem
              key={index}
              nutrient={fn}
              deleteNutrient={() => handleNutrientDelete(fn.nutrientId)}
              updateNutrient={(amount: number) => handleNutrientAmountChange(fn.nutrientId, amount)}
            />
          ))}
        </Grid>
      </Grid>
    </Box>
  );
};
