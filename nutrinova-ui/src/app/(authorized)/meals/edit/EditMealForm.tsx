"use client"
import { useState } from "react";
import { useDeleteMealMutation, useUpdateMealMutation } from "../mealHooks";
import { Meal, UpdateMeal } from "../view/_models/viewMeal";
import { Grid, Button } from "@mui/material";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { AmountInput } from "@/components/forms/AmountInput";
import { UnitOption } from "../../food/_models/unitOption";

interface EditMealFormProps {
  meal: Meal;
  closeModal?: () => void;
}


export const EditMealForm = ({ meal, closeModal }: EditMealFormProps) => {

  const { mutate: updateMeal } = useUpdateMealMutation();

  const { mutate: deleteMeal } = useDeleteMealMutation();

  const [submitted, setSubmitted] = useState<boolean>(false);


  const [mealToUpdate, setMealToUpdate] = useState<UpdateMeal>({
    id: meal.id,
    recordedat: meal.recordedAt,
    unitId: meal.unit.id,
    amount: meal.amount,
  });

  const setAmount = (amount: number) => {
    setMealToUpdate({ ...mealToUpdate, amount: amount });
  }

  const setUnit = (unit: UnitOption) => {
    setMealToUpdate({ ...mealToUpdate, unitId: unit.id });
  }

  const [dateTime, setDateTime] = useState<Date | null>(new Date(meal.recordedAt));

  const handleDelete = () => {
    deleteMeal(meal.id);
    if (closeModal) {
      closeModal();
    }
  }

  const handleUpdate = () => {
    updateMeal({ ...mealToUpdate, recordedat: dateTime as Date });
    setSubmitted(true);
  };

  return (
    <>
      <Grid container spacing={1} justifyContent="flext-start" alignItems="center" marginTop={1}>
        <Grid item xs={12} md={12}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="Recorded Date"
              value={dateTime}
              onChange={(e: Date | null) => setDateTime(e)}
              disableFuture={true}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} md={12} paddingBottom={3}>
          <AmountInput
            amount={mealToUpdate.amount}
            setAmount={setAmount}
            unit={meal.unit ?? ({} as UnitOption)}
            setUnit={setUnit}
            restrictToUnitCategory={
              meal.unit.category.description
            }
            submitted={submitted}
          />
        </Grid>
        <Grid item xs={6} md={6}>
          <Button variant="contained" color="primary" onClick={handleUpdate}>
            Update
          </Button>
        </Grid>
        <Grid item container xs={6} md={6} justifyContent={'flex-end'}>
          <Button variant="contained" color="secondary" onClick={handleDelete}>
            Delete
          </Button>
        </Grid>
      </Grid>
    </>
  );
}