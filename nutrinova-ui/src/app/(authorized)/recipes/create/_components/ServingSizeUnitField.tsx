import SelectUnit from "@/components/forms/SelectUnit";
import { Grid, TextField } from "@mui/material";
import { UnitOption } from "@/app/(authorized)/food/_models/unitOption";

export interface SelectNutrientWithUnitState {
  servingSize?: number;
  servingSizeUnit?: UnitOption | null;
  servingSizeUnitId?: number;
}

interface ServingSizeUnitFieldProps {
  formState: SelectNutrientWithUnitState;
  setFormState: (recipeForm: SelectNutrientWithUnitState) => void;
  formValid: boolean;
}

export const ServingSizeUnitField = ({
  formState,
  setFormState,
  formValid,
}: ServingSizeUnitFieldProps) => {
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
          error={
            !formValid &&
            (formState.servingSize === undefined || formState.servingSize <= 0)
          }
          helperText={
            !formValid &&
            (formState.servingSize === undefined || formState.servingSize <= 0)
              ? "Please enter a valid serving size"
              : ""
          }
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <SelectUnit
          value={formState.servingSizeUnit ? formState.servingSizeUnit : null}
          onSelectedUnitChange={(unit) =>
            setFormState({
              ...formState,
              servingSizeUnit: unit,
              servingSizeUnitId: unit?.id ?? 0,
            })
          }
          error={
            !formValid &&
            (formState.servingSize === undefined ||
              formState.servingSizeUnit === undefined)
          }
          helperText={
            !formValid && formState.servingSizeUnit === undefined
              ? "A unit must be supplied with a serving size"
              : ""
          }
        />
      </Grid>
    </>
  );
};
