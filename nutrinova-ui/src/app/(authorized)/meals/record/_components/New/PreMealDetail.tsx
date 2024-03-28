import { Box, Button, Grid, Typography } from "@mui/material";
import { UnitOption } from "@/app/(authorized)/food/_models/unitOption";
import { RecordMealRequest } from "../../_models/recordMealRequest";
import { AmountInput } from "@/components/forms/AmountInput";
import { PatientContext } from "@/components/providers/PatientProvider";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useState, useContext } from "react";
import { ArrowBack } from "@mui/icons-material";
import { PrepMealItem } from "../../_models/preMealItem";

interface PreMealDetailProps {
  selectedMealItem: PrepMealItem;
  setSelectedMealItem: (selectedMealItem: PrepMealItem | undefined) => void;
  addMeal: (selectedMealItem: RecordMealRequest) => void;
}

export const PreMealDetail: React.FC<PreMealDetailProps> = ({ selectedMealItem, setSelectedMealItem, addMeal }: PreMealDetailProps) => {
  const [amount, setAmount] = useState<number>(selectedMealItem.servingSize);
  const [unit, setUnit] = useState<UnitOption>(selectedMealItem.servingSizeUnit ?? ({} as UnitOption));
  const [recordedAt, setRecordedAt] = useState<Date | null>(new Date(Date.now()));
  const patientContext = useContext(PatientContext);

  const patientName =
    patientContext.selectedPatient?.firstname +
    " " +
    patientContext.selectedPatient?.lastname;

  const handleAddMeal = () => {
    const recordMealRequest = {
      amount,
      mealSelectionType: selectedMealItem.type,
      patientId: patientContext.selectedPatient?.id ?? "",
      recordedAt: recordedAt ?? new Date(Date.now()),
      selectedMealItemId: selectedMealItem.id,
      unitId: unit.id ?? 1,
    };
    addMeal(recordMealRequest);
  }


  return (
    <Box sx={{ mx: "auto" }}>
      <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
        <Button onClick={() => setSelectedMealItem(undefined)} variant="text">
          <ArrowBack />
        </Button>
        <Button type="submit" variant="contained" onClick={handleAddMeal}>
          Record Meal
        </Button>
      </Box>
      <Box sx={{ mt: 2 }}>
        <Typography variant="h5">{selectedMealItem.description}</Typography>
        <Typography>Serving Size: {selectedMealItem.servingSize} {selectedMealItem.servingSizeUnit?.description} | {Math.round(selectedMealItem.calories)} kcal</Typography>
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

      <Box component="form" >
        <AmountInput
          amount={amount}
          setAmount={setAmount}
          unit={unit ?? ({} as UnitOption)}
          setUnit={setUnit}
          restrictToUnitCategory={
            selectedMealItem.servingSizeUnit?.category.description
          }
        />
      </Box>
    </Box>
  );
};