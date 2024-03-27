import { Box, Button, Grid, Typography } from "@mui/material";
import { useAddMealMutation } from "../../../mealHooks";
import { UnitOption } from "@/app/(authorized)/food/_models/unitOption";
import { RecordMealRequest } from "../../_models/recordMealRequest";
import { AmountInput } from "@/components/forms/AmountInput";
import { PatientContext } from "@/components/providers/PatientProvider";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useState, useContext, FormEvent } from "react";
import { ArrowBack } from "@mui/icons-material";
import { PrepMealItem } from "../../_models/preMealItem";

interface PreMealDetailProps {
  selectedMealItem: PrepMealItem;
  setSelectedMealItem: (selectedMealItem: PrepMealItem | undefined) => void;
}

export const PreMealDetail: React.FC<PreMealDetailProps> = ({ selectedMealItem, setSelectedMealItem }: PreMealDetailProps) => {
  const [amount, setAmount] = useState<number>(selectedMealItem.servingSize);
  const [unit, setUnit] = useState<UnitOption>({
    description: selectedMealItem.servingSizeUnit,
  } as UnitOption);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [recordedAt, setRecordedAt] = useState<Date | null>(new Date(Date.now()));
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
        selectedMealItemId: selectedMealItem.id ?? "",
        mealSelectionType: selectedMealItem.type,
      };
      addMeal(recordMealRequest, {
        onSuccess: () => {
          setAmount(0);
          setUnit({ description: "" } as UnitOption);
          setRecordedAt(new Date(Date.now()));
          setSelectedMealItem(undefined);
        },
      });
    }
  };

  return (
    <Box sx={{ mx: "auto" }}>
      <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
        <Button onClick={() => setSelectedMealItem(undefined)} variant="text">
          <ArrowBack />
        </Button>
        <Button type="submit" variant="contained">
          Record Meal
        </Button>
      </Box>
      <Box sx={{ mt: 2 }}>
        <Typography variant="h5">{selectedMealItem.description}</Typography>
        <Typography>Serving Size: {selectedMealItem.servingSize} {selectedMealItem.servingSizeUnit} | {selectedMealItem.calories} kcal</Typography>
      </Box>
      <Grid container spacing={2} sx={{ mt: 2 }}>
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
          // restrictToUnitCategory={
          //   selectedMealItem.servingSizeUnit?.category.description
          // }
          submitted={submitted}
        />
      </Box>
    </Box>
  );
};