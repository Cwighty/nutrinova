"use client";
import { FormEvent, useContext, useState } from "react";
import { Box, Button, Typography, Grid } from "@mui/material";
import { useAddMealMutation } from "../../mealHooks";
import { MealSelectionItem } from "../_models/mealSelectionItem";
import { RecordMealRequest } from "../_models/recordMealRequest";
import { PatientContext } from "@/components/providers/PatientProvider";
import { AmountInput } from "@/components/forms/AmountInput";
import { UnitOption } from "@/app/(authorized)/food/_models/unitOption";
import { MealSelectionItemCard } from "./MealSelectionItemCard";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers";

interface MealDetailsProps {
  selectedFood: MealSelectionItem;
  setActiveStep: (step: number) => void;
}

export const MealDetailsStep = ({
  selectedFood,
  setActiveStep,
}: MealDetailsProps) => {
  const [amount, setAmount] = useState<number>(0);
  const [unit, setUnit] = useState<UnitOption>({
    description: "",
  } as UnitOption);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [recordedAt, setRecordedAt] = useState<Date | null>(
    new Date(Date.now()),
  );
  const { mutate: addMeal } = useAddMealMutation();
  const patientContext = useContext(PatientContext);

  const patientName =
    patientContext.selectedPatient?.firstname +
    " " +
    patientContext.selectedPatient?.lastname;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    if (amount <= 0) {
      return;
    }
    if (unit.description === "") {
      return;
    }
    if (recordedAt) {
      const recordMealRequest: RecordMealRequest = {
        patientId: patientContext.selectedPatient?.id as string,
        amount: amount,
        recordedAt: recordedAt,
        unitId: unit?.id ?? 0,
        selectedMealItemId: selectedFood.id ?? "",
        mealSelectionType: selectedFood.type,
      };
      addMeal(recordMealRequest, {
        onSuccess: () => {
          setActiveStep(0);
          setAmount(0);
          setUnit({ description: "" } as UnitOption);
          setRecordedAt(new Date(Date.now()));
        },
      });
    }
  };

  return (
    <Box sx={{ mx: "auto" }}>
      <Box sx={{ mb: 2 }}>
        <MealSelectionItemCard item={selectedFood} />
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="Recorded Date"
              value={recordedAt}
              onChange={(e: Date | null) => setRecordedAt(e)}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="caption">Selected Patient</Typography>
          <Typography>{patientName}</Typography>
        </Grid>
      </Grid>

      <Box component="form" onSubmit={handleSubmit}>
        <AmountInput
          amount={amount}
          setAmount={setAmount}
          unit={unit ?? ({} as UnitOption)}
          setUnit={setUnit}
          restrictToUnitCategory={
            selectedFood.servingSizeUnit?.category.description
          }
          submitted={submitted}
        />
        <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
          <Button type="submit" variant="contained">
            Record Meal
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
