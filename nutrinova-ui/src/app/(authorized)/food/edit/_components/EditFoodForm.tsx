import { ServingSizeUnitField } from '@/app/(authorized)/recipes/create/_components/ServingSizeUnitField'
import TagInput from '@/components/forms/TagInput'
import { Box, TextField } from '@mui/material'
import React from 'react'
import { EditFoodRequestModel } from '../_models/editFoodRequest'
import { useGetFoodByIdQuery } from "../../foodHooks";

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
    foodNutrients: food?.foodNutrients.map(fn => {
      return {
        nutrientId: fn.nutrientId,
        amount: fn.value,
        unitId: fn.unitId
      }
    }) || [],
    note: food?.note || '',
  })

  return (
    <Box>
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
        tags={editFoodFormState.ingredients || []}
        setTags={(ingredients) => {
          setEditFoodForm({
            ...editFoodFormState,
            ingredients,
          })
        }
        }
      />
      <ServingSizeUnitField
        formState={editFoodFormState}
        setFormState={setEditFoodForm}
        formValid={false} />
      {/* Serving Size */}
      {/* Nutrients */}
      {/* Notes */}
    </Box>
  )
}
