import SelectUnit from "@/components/forms/SelectUnit";
import { Grid, TextField } from "@mui/material";
import { CreateRecipeRequestModel } from "../_models/createRecipeRequest";
import { EditFoodRequestModel } from "../../../food/edit/_models/editFoodRequest";
interface ServingSizeUnitFieldProps {
  formState: CreateRecipeRequestModel | EditFoodRequestModel;
  setFormState: (recipeForm: CreateRecipeRequestModel | EditFoodRequestModel) => void;
  formValid: boolean;
}

export const ServingSizeUnitField = ({ formState, setFormState, formValid }: ServingSizeUnitFieldProps) => {
  return (
    <>
      {/* Serving Size */}
      <Grid item xs={12} md={6}>
        <TextField
          label="Serving Size"
          type="number"
          value={formState.servingSize ?? ""}
          onChange={(e) =>
            setFormState({
              ...formState,
              servingSize: Number(e.target.value),
            })
          }
          fullWidth
          margin="normal"
          error={
            !formValid &&
            formState.servingSize !== undefined &&
            formState.servingSize <= 0
          }
          helperText={
            !formValid &&
              formState.servingSize !== undefined &&
              formState.servingSize <= 0
              ? "Please enter a valid serving size"
              : ""
          }
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <SelectUnit
          value={
            formState.servingSizeUnit
              ? formState.servingSizeUnit
              : null
          }
          onSelectedUnitChange={(unit) =>
            setFormState({
              ...formState,
              servingSizeUnit: unit,
              servingSizeUnitId: unit?.id ?? 0,
            })
          }
          error={
            !formValid &&
            formState.servingSize !== undefined &&
            formState.servingSizeUnit === undefined
          }
          helperText={
            !formValid && formState.servingSize
              ? "A unit must be supplied with a serving size"
              : ""
          }
        />
      </Grid>
    </>
  );
};
