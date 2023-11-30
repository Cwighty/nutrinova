'use client'
import React, { useContext, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Grid,
  TextField
} from '@mui/material';
import { useAddMealMutation } from '../../mealHooks';
import { MealSelectionItem } from '../_models/mealSelectionItem';
import { RecordMealRequest } from '../_models/recordMealRequest';
import { PatientContext } from '@/components/providers/PatientProvider';
import { AmountInput } from '@/components/forms/AmountInput';
import { UnitOption } from '@/app/(authorized)/food/_models/unitOption';
import { MealSelectionItemCard } from './MealSelectionItemCard';

interface MealDetailsProps {
  selectedFood: MealSelectionItem;
  setActiveStep: (step: number) => void;
}

export const MealDetailsStep: React.FC<MealDetailsProps> = ({ selectedFood, setActiveStep }) => {
  const [amount, setAmount] = useState<number>(0);
  const [unit, setUnit] = useState<UnitOption>({ description: "" } as UnitOption);
  const [recordedDate, setRecordedDate] = useState<Date | null>(new Date(Date.now()));
  const { mutate: addMeal } = useAddMealMutation();

  const patientContext = useContext(PatientContext);

  const patientName = patientContext.selectedPatient?.firstname + " " + patientContext.selectedPatient?.lastname;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (recordedDate) {
      const recordMealRequest: RecordMealRequest = {
        patientId: patientContext.selectedPatient?.id as string,
        amount: amount,
        recordedDate: recordedDate,
        unitId: unit?.id ?? 0,
        selectedMealItemId: selectedFood.id ?? "",
        mealSelectionType: selectedFood.type,
      };
      addMeal(recordMealRequest, {
        onSuccess: () => {
          setActiveStep(0);
          setAmount(0);
          setUnit({ description: "" } as UnitOption);
          setRecordedDate(new Date(Date.now()));
        },
      });
    }
  };

  return (
    <Box sx={{ mx: 'auto' }}>

      <Box sx={{ mb: 2 }}>
        <MealSelectionItemCard item={selectedFood} />
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField type="date" label="Recorded Date" value={recordedDate?.toJSON()?.slice(0, 10)} onChange={(e) => setRecordedDate(new Date(e.target.value))} fullWidth required helperText={!recordedDate && "Date is required"} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="caption">Selected Patient</Typography>
          <Typography>{patientName}</Typography>
        </Grid>
      </Grid>

      <Box component="form" onSubmit={handleSubmit}>
        <AmountInput amount={amount} setAmount={setAmount} unit={unit ?? {} as UnitOption} setUnit={setUnit} restrictToUnitCategory={selectedFood.servingSizeUnit?.category.description} />
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained">
            Record Meal
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

