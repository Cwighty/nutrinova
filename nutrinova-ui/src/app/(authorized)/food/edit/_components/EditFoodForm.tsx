"use client"
import { SelectNutrientWithUnitState, ServingSizeUnitField } from '@/app/(authorized)/recipes/create/_components/ServingSizeUnitField'
import TagInput from '@/components/forms/TagInput'
import { Box, Button, TextField } from '@mui/material'
import React from 'react'
import { EditFoodRequestModel } from '../_models/editFoodRequest'
import { useGetFoodByIdQuery } from "../../foodHooks";
import { EditNutrientListItem } from './EditNutrientListItem'

interface Props {
  foodId: string
}

export const EditFoodForm = ({ foodId }: Props) => {

  const { data: food, isLoading: foodIsLoading } = useGetFoodByIdQuery(foodId)

  const [editFoodFormState, setEditFoodForm] = React.useState<EditFoodRequestModel>({
    description: food?.description || '',
    brand: food?.brandName || '',
    ingredients: food?.ingredients?.split(',') || [],
    servingSize: food?.servingSize || 0,
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

  if (foodIsLoading) {
    return <div>Loading...</div>
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
    <>
      <Box>
        <Button onClick={handleSubmit}>Submit</Button>
        <TextField
          id="outlined-basic"
          label="Description/Name"
          variant="outlined"
          value={editFoodFormState.description}
          onChange={(e) => {
            setEditFoodForm({
              ...editFoodFormState,
              description: e.target.value,
            })
          }}
        />
        {/* Brand */}
        <TextField
          id="outlined-basic"
          label="Brand"
          variant="outlined"
          value={editFoodFormState.brand}
          onChange={(e) => {
            setEditFoodForm({
              ...editFoodFormState,
              brand: e.target.value,
            })
          }
          }
        />
        {/* Ingredients */}
        <TagInput
          tags={editFoodFormState?.ingredients || []}
          setTags={(ingredients) => {
            setEditFoodForm({
              ...editFoodFormState,
              ingredients,
            })
          }
          }
        />
        {/* Serving Size */}
        <ServingSizeUnitField
          formState={editFoodFormState}
          setFormState={handleSelectServingSizeUpdate}
          formValid={false} />
        {/* Nutrients */}
        <>
          {editFoodFormState.foodNutrients != undefined && editFoodFormState.foodNutrients.map((fn) => {
            <>
              <EditNutrientListItem nutrient={fn} deleteNutrient={() => {
                handleNutrientDelete(fn.nutrientId)
              }} updateNutrient={function (fn): void {
                console.log(fn)
              }} />
            </>
          })}
        </>
        {/* Notes */}
        <TextField id="outlined-basic" label="Notes" variant="outlined" fullWidth />
      </Box>
    </>
  )
}
