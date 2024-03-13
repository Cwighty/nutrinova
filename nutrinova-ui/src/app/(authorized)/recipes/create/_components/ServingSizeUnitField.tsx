import SelectUnit from "@/components/forms/SelectUnit";
import { Grid, TextField } from "@mui/material";
import { UnitOption } from "@/app/(authorized)/food/_models/unitOption";
import { ChangeEvent } from "react";

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
  const handleServingSizeChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "" || /^\d*\.?\d*$/.test(e.target.value)) {
      const servingSize =
        e.target.value === "" ? "" : parseFloat(e.target.value);
      if (servingSize !== "") {
        setFormState({
          ...formState,
          servingSize: servingSize,
        });
      }
      if (servingSize === "") {
        setFormState({
          ...formState,
          servingSize: undefined,
        });
      }
    }
  };

  return (
    <>
      <Grid item xs={12} md={6} mb={2} lg={12}>
        <TextField
          label="Serving Size"
          value={formState.servingSize ?? ""}
          onChange={handleServingSizeChange}
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

      <Grid item xs={12} md={6} lg={12}>
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
