'use client'
import React, { useEffect } from 'react';
import { Box, TextField, Typography, Link } from "@mui/material";
import { AmountInput } from "@/components/forms/AmountInput";
import { CreateRecipeFoodModel } from "../../_models/createRecipeFoodModel";
import { SelectedRecipeFoodCard } from '../SelectedFoodCard';
import { useGetFoodByIdQuery, useGetUnitsQuery } from '@/app/(authorized)/food/foodHooks';

interface SelectAmountStepProps {
  newFood: CreateRecipeFoodModel;
  setNewFood: (newFood: CreateRecipeFoodModel) => void;
  setConversionRateRequired: (required: boolean) => void;
}

export const SelectAmountStep: React.FC<SelectAmountStepProps> = ({
  newFood,
  setNewFood,
  setConversionRateRequired
}) => {
  const { data: food } = useGetFoodByIdQuery(newFood.foodId);
  const { data: unitOptions } = useGetUnitsQuery();
  const newFoodUnit = unitOptions?.find(u => u.id === newFood.measurementUnitId);

  const requireConversionRate = (food?.unit && newFoodUnit?.category.description !== food?.unit.category.description) ?? false;

  useEffect(() => {
    setConversionRateRequired(requireConversionRate);
  }, [requireConversionRate, setConversionRateRequired]);


  return (
    <>
      <Box sx={{ my: 2 }}>
        <SelectedRecipeFoodCard item={newFood} />
      </Box>
      <AmountInput
        amount={newFood.measurement}
        setAmount={(amount) =>
          setNewFood({
            ...newFood,
            measurement: amount,
          })
        }
        unit={{
          id: newFood.measurementUnitId,
          description: newFood.measurementUnitName,
          abbreviation: "",
          categoryId: newFood.measurementUnitId,
          category: {
            id: newFood.measurementUnitId,
            description: "",
          },
        }}
        setUnit={(unit) =>
          setNewFood({
            ...newFood,
            measurementUnitId: unit.id,
            measurementUnitName: unit.description,
          })
        }
      />
      {requireConversionRate && newFood.measurementUnitId &&
        (
          <Box sx={{ my: 2 }}>
            <Typography>
              This food&apos;s serving is measured in <b>{food?.unit.description}s</b>,
              to add <b>{newFood.measurementUnitName}s</b> of this food to your recipe we need some information:
            </Typography>
            <Typography sx={{ mt: 2 }}>
              {`How many ${food?.unit.description}s are in 1 ${newFood.measurementUnitName} of '${newFood.name}'?`}
            </Typography>
            <TextField
              label={`${food?.unit.description}s in 1 ${newFood.measurementUnitName} of '${newFood.name}'`}
              type="number"
              value={newFood.foodServingsPerMeasurement || ""}
              onChange={(e) => setNewFood({ ...newFood, foodServingsPerMeasurement: Number(e.target.value) })}
              fullWidth
              margin="normal"
              required
            />
            <Typography>
              Need help finding out?
            </Typography>
            <Link href={`https://www.google.com/search?q=how+many+${food?.unit.description}+in+1+${newFood.measurementUnitName}+of+${newFood.name}`} target="_blank">
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
