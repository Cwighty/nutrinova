import React, { useState } from 'react'
import { EditRecipeFoodRequestModel } from '../_models/EditRecipeRequestModel';
import { useGetUnitsQuery } from '@/app/(authorized)/food/foodHooks';
import { Alert, Button, Grid, InputAdornment, Skeleton, TextField, Typography } from '@mui/material';

interface EditRecipeFoodListItemProp {
  food: EditRecipeFoodRequestModel;
  deleteFood: () => void;
  updateFood: (nutrientAmount: number) => void;
  inputOptions?: {
    helperText?: string;
    error?: boolean;
  };
}

export const EditRecipeFoodItem = ({ food, deleteFood, updateFood, inputOptions }: EditRecipeFoodListItemProp) => {

  const { data: unitOptions, isLoading: unitOptionsLoading, isError: unitOptionsIsError } = useGetUnitsQuery();
  const [unitAmount, setUnitAmount] = useState<number | null>(food.servingSize);
  const handleNutrientAmountChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newAmount = parseFloat(event.target.value) ?? null;
    setUnitAmount(newAmount);
    updateFood(newAmount);
  }

  if (unitOptionsLoading) {
    return <Skeleton variant="rounded" width="100%" height={40} />;
  }

  if (unitOptionsIsError) {
    return <Alert severity="error">Error loading, try again later</Alert>;
  }

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12} sm={5} md={4} lg={3}>
        <Typography variant="subtitle1">{food?.name}</Typography>
      </Grid>
      <Grid item xs={8} sm={5} md={6} lg={7}>
        <TextField
          error={inputOptions?.error}
          helperText={inputOptions?.error ? inputOptions?.helperText : ''}
          label="Amount"
          type="number"
          fullWidth
          value={unitAmount ?? ''}
          onChange={handleNutrientAmountChange}
          InputProps={{
            inputProps: { min: 0 },
            endAdornment: <InputAdornment position="end">{unitOptions?.find(u => u.id = food.unitId)?.abbreviation || ""}</InputAdornment>,
          }}
        />
      </Grid>
      <Grid item xs={4} sm={2} md={2} lg={2}>
        <Button variant="outlined" color="error" onClick={deleteFood}>
          Delete
        </Button>
      </Grid>
    </Grid>
  )
}
