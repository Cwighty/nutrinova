"use client";

import { NutrientOption } from "@/app/(authorized)/food/_models/nutrientOption";
import { COMPARISON_OPERATOR_OPTIONS } from "@/app/(authorized)/food/_models/comparisonOperatorOptions";
import { UnitOption } from "@/app/(authorized)/food/_models/unitOption";
import {
  useGetNutrientsQuery,
  useGetUnitsQuery,
} from "@/app/(authorized)/food/foodHooks";
import {
  Alert,
  Autocomplete,
  Box,
  Grid,
  InputAdornment,
  MenuItem,
  Select,
  SelectChangeEvent,
  Skeleton,
  TextField,
} from "@mui/material";
import { ChangeEvent, ReactNode, SyntheticEvent, useState } from "react";
import { ChangeEventHandler } from "preact/compat";

interface SelectNutrientProps {
  error?: boolean;
  helperText?: string;
  canCompare?: boolean;
  onSelectedNutrientChange: (nutrient: NutrientOption | null) => void;
  onNutrientAmountChange: (
    amount: number | null,
    unit: UnitOption | null,
  ) => void;
  onComparisonOperatorChange: (comparisonOperator: string) => void;
}

const SelectNutrient = ({
  error,
  helperText,
  canCompare = false,
  onComparisonOperatorChange,
  onNutrientAmountChange,
  onSelectedNutrientChange,
}: SelectNutrientProps) => {
  const {
    data: nutrientOptions,
    isLoading: nutrientOptionsLoading,
    isError: nutrientOptionsIsError,
  } = useGetNutrientsQuery();
  const {
    data: unitOptions,
    isLoading: unitOptionsLoading,
    isError: unitOptionsIsError,
  } = useGetUnitsQuery();

  const [selectedNutrient, setSelectedNutrient] =
    useState<NutrientOption | null>(null);

  const [comparisonOperator, setComparisonOperator] = useState<string>("");

  const handleNutrientSelectionChange = (
    _: SyntheticEvent<Element, Event>,
    value: NutrientOption | null,
  ) => {
    setSelectedNutrient(value);
    onSelectedNutrientChange(value);
  };

  const handleComparisonOperatorChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setComparisonOperator(event.target.value);
    onComparisonOperatorChange(event.target.value);
  };

  const handleNutrientAmountChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const newAmount = parseFloat(event.target.value) ?? null;
    const newUnit =
      unitOptions?.find((u) => u.id === selectedNutrient?.preferredUnit) ??
      null;
    onNutrientAmountChange(newAmount, newUnit);
  };

  if (nutrientOptionsLoading || unitOptionsLoading) {
    return <Skeleton variant="rounded" width={400} height={40} />;
  }
  if (nutrientOptionsIsError || unitOptionsIsError) {
    return (
      <Alert severity="error">
        Error loading nutrient options, try again later
      </Alert>
    );
  }
  return (
    <>
      {nutrientOptions && unitOptions && (
        <Grid container>
          <Grid item xs={12} md={3}>
            <Autocomplete
              options={nutrientOptions}
              getOptionLabel={(option) => option.nutrientName}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Nutrient"
                  sx={{ flexGrow: 1 }}
                  error={error}
                  helperText={helperText}
                />
              )}
              onChange={handleNutrientSelectionChange}
            />
          </Grid>
          {canCompare && (
            <Grid item xs={12} md={3}>
              <TextField
                select
                value={comparisonOperator}
                label="Comparison"
                sx={{ ml: 2 }}
                onChange={handleComparisonOperatorChange}
              >
                {COMPARISON_OPERATOR_OPTIONS.map((option) => (
                  <MenuItem key={option.id} value={option.abbreviation}>
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          )}
          <Grid item xs={12} md={3}>
            <TextField
              error={error}
              helperText={helperText}
              label="Amount"
              type="number"
              sx={{ ml: 2, flexGrow: 1, maxWidth: "50%" }}
              onChange={handleNutrientAmountChange}
              InputProps={{
                inputProps: { min: 0 },
                endAdornment: (
                  <InputAdornment position="end">
                    {unitOptions.find(
                      (u) => u.id === selectedNutrient?.preferredUnit,
                    )?.abreviation ?? ""}
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default SelectNutrient;
