'use client'
import React, { useContext, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { useAddMealMutation } from '../../mealHooks';
import { MealSelectionItem } from '../_models/mealSelectionItem';
import { MealItemType, RecordMealRequest } from '../_models/recordMealRequest';
import { PatientContext } from '@/components/providers/PatientProvider';

interface MealDetailsProps {
  selectedFood: MealSelectionItem;
}

export const MealDetailsStep: React.FC<MealDetailsProps> = ({ selectedFood }) => {
  const [amount, setAmount] = useState<number>(0);
  const [unitId, setUnitId] = useState<number>(1); // Default to 1 for the sake of this example
  const [recordedDate, setRecordedDate] = useState<Date | null>(new Date());
  const { mutate: addMeal } = useAddMealMutation();

  const patientContext = useContext(PatientContext);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (recordedDate) {
      const recordMealRequest: RecordMealRequest = {
        patientId: patientContext.selectedPatient?.id as string,
        amount: amount,
        recordedDate: recordedDate,
        unitId: unitId,
        selectedMealItemId: selectedFood.id ?? "",
        mealType: MealItemType[selectedFood.type as keyof typeof MealItemType],
      };
      addMeal(recordMealRequest);
    } else {
      // Handle the error state
      console.error('Recorded date is required.');
    }
  };
  enum MyEnum {
    Value1 = 'Value 1',
    Value2 = 'Value 2',
    Value3 = 'Value 3',
  }

  const str: string = 'Value 2';
  const enumValue: MyEnum = MyEnum[str as keyof typeof MyEnum];

  console.log(enumValue); // Output: Value2

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto' }}>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6">Selected Food</Typography>
          <Typography>{selectedFood.description}</Typography>
          <Typography variant="h6">Selected Patient</Typography>
          <Typography>{patientContext.selectedPatient?.firstname ?? "" + patientContext.selectedPatient?.lastname}</Typography>
        </CardContent>
      </Card>

      <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          margin="normal"
        />

        {/* Replace this with your units data */}
        <FormControl fullWidth margin="normal">
          <InputLabel id="unit-label">Unit</InputLabel>
          <Select
            labelId="unit-label"
            id="unit-select"
            value={unitId}
            label="Unit"
            onChange={(e) => setUnitId(Number(e.target.value))}
          >
            {/* Replace with your actual unit options */}
            <MenuItem value={1}>Grams</MenuItem>
            <MenuItem value={2}>Milliliters</MenuItem>
            {/* ...other units */}
          </Select>
        </FormControl>


        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained">
            Record Meal
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

