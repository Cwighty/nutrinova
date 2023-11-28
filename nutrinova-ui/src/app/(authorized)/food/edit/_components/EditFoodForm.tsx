'use client'
import { SelectNutrientWithUnitState, ServingSizeUnitField } from '@/app/(authorized)/recipes/create/_components/ServingSizeUnitField'
import TagInput from '@/components/forms/TagInput'
import { Alert, Box, Button, Grid, TextField } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import { EditFoodRequestModel } from '../_models/editFoodRequest'
import { useEditFoodMutation, useGetFoodByIdQuery, useGetUnitsQuery } from "../../foodHooks";
import { EditNutrientListItem } from './EditNutrientListItem'
import toast from 'react-hot-toast'
import { AddNutrientDialog } from '../../create/_components/AddNutrientDialog'
import { EditFoodNutrientRequestModel } from '../_models/editFoodNutrientRequest'

interface Props {
  foodId: string
}

export const EditFoodForm = ({ foodId }: Props) => {

  const { data: food, isLoading: foodIsLoading, isFetching } = useGetFoodByIdQuery(foodId);
  const { data: unitOptions } = useGetUnitsQuery();
  const editFoodMutation = useEditFoodMutation();

  const [isValid, setIsValid] = useState<boolean>(false);
  const [servingSizeIsValid, setServingSizeIsValid] = useState<boolean>(false);
  const [foodNutrientsAreValid, setFoodNutrientsAreValid] = useState<boolean>(false);
  const [newNutrient, setNewNutrient] = useState<EditFoodNutrientRequestModel>({ nutrientId: 0, amount: 0, unitId: 0, nutrientName: '', unitCategoryId: 0 });

  const [editFoodFormState, setEditFoodForm] = React.useState<EditFoodRequestModel>({
    id: "",
    description: food?.description,
    brandName: food?.brandName,
    ingredients: food?.ingredients?.split(','),
    unitCategoryId: food?.unitCategoryId,
    servingSize: food?.servingSize,
    servingSizeUnit: unitOptions?.find(u => u.abbreviation === food?.servingSizeUnit) || null,
    foodNutrients: food?.foodNutrients?.map(fn => {
      return {
        nutrientId: fn.nutrientId,
        amount: fn.value,
        unitId: fn.unitId, // doesn't get defined on load. Gets set in api call
        nutrientName: fn.nutrientName,
        unitCategoryId: fn?.categoryId,
      }
    }) || [],
    note: food?.note || '',
  })

  const handleAddNutrient = () => {
    if (newNutrient.amount <= 0) {
      toast.error("Nutrient amount must be greater than 0");
      return;
    }
    if (newNutrient.nutrientName == "") {
      toast.error("Nutrient must be selected");
      return;
    }
    const newNutrientList = editFoodFormState?.foodNutrients !== undefined
      ? [...editFoodFormState.foodNutrients, newNutrient]
      : [newNutrient]
    setEditFoodForm({
      ...editFoodFormState,
      foodNutrients: newNutrientList,
    });
    setNewNutrient({ nutrientId: 0, amount: 0, unitId: 0, nutrientName: '', unitCategoryId: 0 });
  }


  const validateForm = () => {
    const validateServing = () => {
      const isValid = editFoodFormState.servingSize
        && editFoodFormState.servingSize > 0
        && editFoodFormState.servingSizeUnit != null
        && editFoodFormState.servingSizeUnit != undefined
      setServingSizeIsValid(isValid || false);
      return isValid;

    }
    const validateNutrients = () => {

      const isValid = editFoodFormState?.foodNutrients?.every(n => n.amount > 0) && editFoodFormState.foodNutrients.length > 0;
      setFoodNutrientsAreValid(isValid || false);
      return isValid;
    }
    return validateServing() && validateNutrients();
  }

  const validateFormCallback = useCallback(validateForm, [editFoodFormState]);
  useEffect(() => {
    setIsValid(validateFormCallback() || false);
  }, [editFoodFormState, validateFormCallback])

  if (foodIsLoading || isFetching) {
    return <div>Loading...</div>
  }

  if (food?.id !== editFoodFormState.id) {
    setEditFoodForm(
      {
        id: foodId,
        description: food?.description,
        brandName: food?.brandName,
        ingredients: food?.ingredients?.split(','),
        unitCategoryId: food?.unitCategoryId,
        servingSize: food?.servingSize,
        servingSizeUnit: unitOptions?.find(u => u.abbreviation === food?.servingSizeUnit) || null,
        foodNutrients: food?.foodNutrients?.map(fn => {
          return {
            nutrientId: fn.nutrientId,
            amount: fn.value,
            unitId: fn.unitId, // doesn't get defined on load. Gets set in api call
            nutrientName: fn.nutrientName,
            unitCategoryId: fn?.categoryId,
          }
        }) || [],
        note: food?.note || '',
      }
    )
  }

  const handleNutrientAmountChange = (nutrientId: number, amount: number) => {
    if (editFoodFormState?.foodNutrients) {
      const updatedNutrientState = {
        ...editFoodFormState, foodNutrients: editFoodFormState?.foodNutrients.map(n => {
          if (n.nutrientId === nutrientId) {
            return {
              ...n,
              unitId: n.unitId,
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
    console.log(editFoodFormState);
    if (!isValid) {
      toast.error("Invalid Form");
    } else {
      editFoodMutation.mutate(editFoodFormState, {
        onSuccess: () => {

        },
      });
    }
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
            value={editFoodFormState.brandName}
            onChange={(e) => {
              setEditFoodForm({
                ...editFoodFormState,
                brandName: e.target.value,
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
          <AddNutrientDialog handleAddNutrient={handleAddNutrient} newNutrient={newNutrient} setNewNutrient={(newNutrient) => setNewNutrient(newNutrient)} />
          {(editFoodFormState.foodNutrients?.length === 0) && <Alert severity='warning'> Foods need at least one nutrient </Alert>}
          {editFoodFormState.foodNutrients?.map((fn, index) => (
            <EditNutrientListItem
              key={index}
              nutrient={fn}
              deleteNutrient={() => handleNutrientDelete(fn.nutrientId)}
              updateNutrient={(amount: number) => handleNutrientAmountChange(fn.nutrientId, amount)}
              inputOptions={{
                error: !foodNutrientsAreValid,
                helperText: !foodNutrientsAreValid ? "Nutrients must have a value greater than 0" : undefined,
              }}
            />
          ))}
        </Grid>
      </Grid>
    </Box>
  );
};
