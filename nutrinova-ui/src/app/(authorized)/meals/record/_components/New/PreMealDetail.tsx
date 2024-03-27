import { Box, Button, Grid, Typography } from "@mui/material";
import { useAddMealMutation } from "../../../mealHooks";
import { UnitOption } from "@/app/(authorized)/food/_models/unitOption";
import { RecordMealRequest } from "../../_models/recordMealRequest";
import { MealSelectionItem } from "../../_models/mealSelectionItem";
import { AmountInput } from "@/components/forms/AmountInput";
import { PatientContext } from "@/components/providers/PatientProvider";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useState, useContext, FormEvent } from "react";
import { MealSelectionItemCard } from "../MealSelectionItemCard";
import { ArrowBack } from "@mui/icons-material";

interface PreMealDetailProps {
  onClose: () => void;
  selectedFood: MealSelectionItem;
}

export const PreMealDetail: React.FC<PreMealDetailProps> = ({ selectedFood, onClose }: PreMealDetailProps) => {
  const [amount, setAmount] = useState<number>(0);
  const [unit, setUnit] = useState<UnitOption>({
    description: "",
  } as UnitOption);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [recordedAt, setRecordedAt] = useState<Date | null>();
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
          setAmount(0);
          setUnit({ description: "" } as UnitOption);
          setRecordedAt(new Date(Date.now()));
          onClose();
        },
      });
    }
  };

  return (
    <Box sx={{ mx: "auto" }}>
      <Box>
        <Button onClick={onClose} variant="text">
          <ArrowBack />
        </Button>
      </Box>
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