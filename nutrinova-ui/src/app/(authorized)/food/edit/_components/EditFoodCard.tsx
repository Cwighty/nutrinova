
import React from 'react'
import { EditFoodForm } from './EditFoodForm'
import { Box } from '@mui/material'

interface Props {
  foodId: string
}

export const EditFoodCard = ({ foodId }: Props) => {
  return (
    <Box>
      <EditFoodForm foodId={foodId} />
    </Box>
  )
}
