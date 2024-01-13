'use client'
import React, { useEffect } from 'react';
import { Box, TextField, Typography, Link } from "@mui/material";
import { AmountInput } from "@/components/forms/AmountInput";
import { CreateRecipeFoodModel } from "../../_models/createRecipeFoodModel";
import { SelectedRecipeFoodCard } from '../SelectedFoodCard';
import { useGetFoodByIdQuery, useGetUnitsQuery } from '@/app/(authorized)/food/foodHooks';
import { useGetMatchingFoodConversionSampleQuery } from '../../../foodConversionSampleHooks';

interface SelectAmountStepProps {
  newFood: CreateRecipeFoodModel;
  setNewFood: (newFood: CreateRecipeFoodModel) => void;
  setConversionRateRequired: (required: boolean) => void;
}

export const SelectAmountStep: React.FC<SelectAmountStepProps> = ({
  newFood: newRecipeFood,
  setNewFood,
  setConversionRateRequired
}) => {
  const { data: food } = useGetFoodByIdQuery(newRecipeFood.foodId);
  const { data: unitOptions } = useGetUnitsQuery();
  const { data: foodConversionSample } = useGetMatchingFoodConversionSampleQuery(newRecipeFood.foodId, newRecipeFood.measurementUnitId);
  const newFoodUnit = unitOptions?.find(u => u.id === newRecipeFood.measurementUnitId);


  const requireConversionRate = (
    food?.unit &&
    newFoodUnit?.category.description !== food?.unit.category.description &&
    !foodConversionSample
  ) ?? false;

  useEffect(() => {
    setConversionRateRequired(requireConversionRate);
  }, [requireConversionRate, setConversionRateRequired]);


  return (
    <>
      <Box sx={{ my: 2 }}>
        <SelectedRecipeFoodCard item={newRecipeFood} />
      </Box>
      <AmountInput
        amount={newRecipeFood.measurement}
        setAmount={(amount) =>
          setNewFood({
            ...newRecipeFood,
            measurement: amount,
          })
        }
        unit={{
          id: newRecipeFood.measurementUnitId,
          description: newRecipeFood.measurementUnitName,
          abbreviation: "",
          categoryId: newRecipeFood.measurementUnitId,
          category: {
            id: newRecipeFood.measurementUnitId,
            description: "",
          },
        }}
        setUnit={(unit) =>
          setNewFood({
            ...newRecipeFood,
            measurementUnitId: unit.id,
            measurementUnitName: unit.description,
          })
        }
      />
      {foodConversionSample &&
        <Box sx={{ my: 2 }}>
          <Typography>
            {`1 ${newRecipeFood.measurementUnitName} of '${newRecipeFood.name}' is equivalent to ${foodConversionSample.foodServingsPerMeasurement} ${food?.unit.description}s`}
          </Typography>
        </Box>
      }
      {requireConversionRate && newRecipeFood.measurementUnitId &&
        (
          <Box sx={{ my: 2 }}>
            <Typography>
              This food&apos;s serving is measured in <b>{food?.unit.description}s</b>,
              to add <b>{newRecipeFood.measurementUnitName}s</b> of this food to your recipe we need some information:
            </Typography>
            <Typography sx={{ mt: 2 }}>
              {`How many ${food?.unit.description}s are in 1 ${newRecipeFood.measurementUnitName} of '${newRecipeFood.name}'?`}
            </Typography>
            <TextField
              label={`${food?.unit.description}s in 1 ${newRecipeFood.measurementUnitName} of '${newRecipeFood.name}'`}
              type="number"
              value={newRecipeFood.foodServingsPerMeasurement || ""}
              onChange={(e) => setNewFood({ ...newRecipeFood, foodServingsPerMeasurement: Number(e.target.value) })}
              fullWidth
              margin="normal"
              required
            />
            <Typography>
              Need help finding out?
            </Typography>
            <Link href={`https://www.google.com/search?q=how+many+${food?.unit.description}+in+1+${newRecipeFood.measurementUnitName}+of+${newRecipeFood.name}`} target="_blank">
              Ask Google
            </Link>
            <br></br>
            <Link href="chat.openai.com" target="_blank">
              Ask Nova
            </Link>
          </Box>
        )}
    </>
  );
};
