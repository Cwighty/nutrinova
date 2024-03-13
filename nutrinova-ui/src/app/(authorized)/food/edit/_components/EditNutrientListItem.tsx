import {
  Typography,
  Button,
  InputAdornment,
  TextField,
  Skeleton,
  Alert,
  Grid,
} from "@mui/material";
import { EditFoodNutrientRequestModel } from "../_models/editFoodNutrientRequest";
import { useGetUnitsQuery } from "../../foodHooks";
import { ChangeEvent, useState } from "react";

interface EditNutrientListItemProp {
  nutrient: EditFoodNutrientRequestModel;
  deleteNutrient: () => void;
  updateNutrient: (nutrientAmount: number | "") => void;
  inputOptions?: {
    helperText?: string;
    error?: boolean;
  };
}

export const EditNutrientListItem = ({
  nutrient,
  deleteNutrient,
  updateNutrient,
  inputOptions,
}: EditNutrientListItemProp) => {
  const {
    data: unitOptions,
    isLoading: unitOptionsLoading,
    isError: unitOptionsIsError,
  } = useGetUnitsQuery();
  const [unitAmount, setUnitAmount] = useState<number | string>(
    nutrient.amount,
  );

  const handleNutrientAmountChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const value = event.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      const newAmount = value === "" ? "" : parseFloat(value);
      setUnitAmount(newAmount);
      updateNutrient(newAmount);
    }
  };

  if (unitOptionsLoading) {
    return <Skeleton variant="rounded" width="100%" height={40} />;
  }

  if (unitOptionsIsError) {
    return <Alert severity="error">Error loading, try again later</Alert>;
  }

  return (
    <Grid container sx={{ m: 2 }} alignItems="center">
      <Grid item xs={12} sm={5} md={4} lg={3} sx={{ mb: 1 }}>
        <Typography variant="subtitle1">{nutrient.nutrientName}</Typography>
      </Grid>
      <Grid item xs={8} sm={5} md={6} lg={7}>
        <TextField
          error={inputOptions?.error}
          helperText={inputOptions?.helperText}
          label="Amount"
          fullWidth
          value={unitAmount ?? ""}
          onChange={handleNutrientAmountChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {unitOptions?.find((u) => u.id === nutrient.unitId)
                  ?.abbreviation ?? ""}
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid item xs={4} sm={2} md={2} lg={2}>
        <Button
          variant="outlined"
          color="error"
          sx={{ ml: 2 }}
          onClick={deleteNutrient}
        >
          Delete
        </Button>
      </Grid>
    </Grid>
  );
};
