import SelectUnit from "@/components/forms/SelectUnit";
import { Grid, TextField } from "@mui/material";
import { CreateRecipeRequestModel } from "../_models/createRecipeRequest";

interface ServingSizeUnitFieldProps {
    recipeFormState: CreateRecipeRequestModel;
    setRecipeFormState: (recipeForm : CreateRecipeRequestModel) => void;
    formValid: boolean;
}

export const ServingSizeUnitField = ({ recipeFormState, setRecipeFormState, formValid } : ServingSizeUnitFieldProps) => {
  return (
    <>
      {/* Serving Size */}
      <Grid item xs={12} md={6}>
        <TextField
          label="Serving Size"
          type="number"
          value={recipeFormState.servingSize ?? ""}
          onChange={(e) =>
            setRecipeFormState({
              ...recipeFormState,
              servingSize: Number(e.target.value),
            })
          }
          fullWidth
          margin="normal"
          error={
            !formValid &&
            recipeFormState.servingSize !== undefined &&
            recipeFormState.servingSize <= 0
          }
          helperText={
            !formValid &&
            recipeFormState.servingSize !== undefined &&
            recipeFormState.servingSize <= 0
              ? "Please enter a valid serving size"
              : ""
          }
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <SelectUnit
          value={
            recipeFormState.servingSizeUnit
              ? recipeFormState.servingSizeUnit
              : null
          }
          onSelectedUnitChange={(unit) =>
            setRecipeFormState({
              ...recipeFormState,
              servingSizeUnit: unit,
              servingSizeUnitId: unit?.id ?? 0,
            })
          }
          error={
            !formValid &&
            recipeFormState.servingSize !== undefined &&
            recipeFormState.servingSizeUnit === undefined
          }
          helperText={
            !formValid && recipeFormState.servingSize
              ? "A unit must be supplied with a serving size"
              : ""
          }
        />
      </Grid>
    </>
  );
};
