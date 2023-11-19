import { Typography, Box, Button, InputAdornment, TextField, Skeleton, Alert } from "@mui/material";
import { EditFoodNutrientRequestModel } from "../_models/editFoodNutrientRequest"
import { useGetUnitsQuery } from "../../foodHooks";

interface EditNutrientListItemProp {
  nutrient: EditFoodNutrientRequestModel;
  deleteNutrient: () => void;
  updateNutrient: (nutrientAmount: number) => void;
  inputOptions?: {
    helperText?: string;
    error?: boolean;
  };
}

export const EditNutrientListItem = ({ nutrient, deleteNutrient, updateNutrient, inputOptions }: EditNutrientListItemProp) => {

  const { data: unitOptions, isLoading: unitOptionsLoading, isError: unitOptionsIsError } = useGetUnitsQuery();

  const handleNutrientAmountChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newAmount = parseFloat(event.target.value) ?? null;
    updateNutrient(newAmount);
  }

  if (unitOptionsLoading) {
    return <Skeleton variant="rounded" width={400} height={40} />;
  }

  if (unitOptionsIsError) {
    return <Alert severity="error">Error loading, try again later</Alert>;
  }
  return (
    <>
      <Box>
        {unitOptions &&
          <>
            <Typography>{nutrient.nutrientName}</Typography>
            <Button onClick={() => deleteNutrient()}> Delete</Button>
            <TextField
              error={inputOptions?.error}
              helperText={inputOptions?.helperText}
              label="Amount"
              type="number"
              sx={{ width: 140 }}
              onChange={handleNutrientAmountChange}
              InputProps={{
                inputProps: { min: 0 },
                endAdornment: <InputAdornment position="end">{unitOptions.find(u => u.id === nutrient.unitId)?.abreviation ?? ''}</InputAdornment>,
              }}
            />
          </>
        }
      </Box>
    </>
  )
}
