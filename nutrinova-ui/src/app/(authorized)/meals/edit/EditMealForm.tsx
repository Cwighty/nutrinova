"use client"
import { useState } from "react";
import { useUpdateMealMutation } from "../mealHooks";
import { Meal, UpdateMeal } from "../view/_models/viewMeal";
import { Grid, Button } from "@mui/material";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { AmountInput } from "@/components/forms/AmountInput";
import { UnitOption } from "../../food/_models/unitOption";

interface EditMealFormProps {
  meal: Meal;
}


export const EditMealForm = ({ meal }: EditMealFormProps) => {

  const { mutate: updateMeal } = useUpdateMealMutation();

  const [submitted, setSubmitted] = useState<boolean>(false);

  const [mealToUpdate, setMealToUpdate] = useState<UpdateMeal>({
    id: meal.id,
    recordedat: meal.recordedAt,
    unitId: meal.unit.id,
    amount: meal.amount,
  });

  const setAmount = (amount: number) => {
    setMealToUpdate({ ...mealToUpdate, amount });
  }

  const setUnit = (unit: UnitOption) => {
    setMealToUpdate({ ...mealToUpdate, unitId: unit.id });
  }

  const [dateTime, setDateTime] = useState<Date | null>(new Date(meal.recordedAt));


  const handleUpdate = () => {
    updateMeal(mealToUpdate);
    setSubmitted(true);
  };

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DateTimePicker
          label="Recorded Date"
          value={dateTime}
          onChange={(e: Date | null) => setDateTime(e)}
        />
      </LocalizationProvider>
      <AmountInput
        amount={meal.amount}
        setAmount={setAmount}
        unit={meal.unit ?? ({} as UnitOption)}
        setUnit={setUnit}
        restrictToUnitCategory={
          meal.unit.category.description
        }
        submitted={submitted}
      />
      <Grid container spacing={2} justifyContent="flex-end" alignItems="center" marginTop={2}>
        <Grid item>
          <Button variant="contained" color="primary" onClick={handleUpdate}>
            Finished
          </Button>
        </Grid>
        {/* <Grid item>
          <IconButton aria-label="delete" onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        </Grid> */}
      </Grid>
      <Button variant="text" onClick={() => { /* handle change patient */ }}>
        Change Patient
      </Button>
    </>
  );
}