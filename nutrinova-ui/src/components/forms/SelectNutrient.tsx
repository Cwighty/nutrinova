"use client";

import { NutrientOption } from "@/app/(authorized)/food/_models/nutrientOption";
import { UnitOption } from "@/app/(authorized)/food/_models/unitOption";
import {
  useGetNutrientsQuery,
  useGetUnitsQuery,
} from "@/app/(authorized)/food/foodHooks";
import {
  Alert,
  Autocomplete,
  Grid,
  InputAdornment,
  Skeleton,
  TextField,
} from "@mui/material";
import React, { SyntheticEvent, useState } from "react";

interface SelectNutrientProps {
  error?: boolean;
  helperText?: string;
  onSelectedNutrientChange: (nutrient: NutrientOption | null) => void;
  onNutrientAmountChange: (
    amount: number | null,
    unit: UnitOption | null
  ) => void;
}

const SelectNutrient = (inputProps: SelectNutrientProps) => {
  const { data: nutrientOptions, isLoading: nutrientOptionsLoading, isError: nutrientOptionsIsError } = useGetNutrientsQuery();
  const { data: unitOptions, isLoading: unitOptionsLoading, isError: unitOptionsIsError } = useGetUnitsQuery();

  const [selectedNutrient, setSelectedNutrient] = useState<NutrientOption | null>(null);

  const handleNutrientSelectionChange = (
    _: SyntheticEvent<Element, Event>,
    value: NutrientOption | null
  ) => {
    setSelectedNutrient(value);
    inputProps.onSelectedNutrientChange(value);
  };

  const handleNutrientAmountChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newAmount = parseFloat(event.target.value) ?? null;
    const newUnit =
      unitOptions?.find((u) => u.id === selectedNutrient?.preferredUnitId) ??
      null;
    inputProps.onNutrientAmountChange(newAmount, newUnit);
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
        <Grid container columnSpacing={1} justifyContent={"flex-end"}>
          <Grid item xs={12} md={6}>
            <Autocomplete
              options={nutrientOptions}
              groupBy={(option) => option.categoryName}
              getOptionLabel={(option) => `${option.description}`}
              renderOption={(props, option) => {
                return (
                  <li {...props} key={option.id}>
                    {option.description}
                  </li>
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Nutrient"
                  sx={{ flexGrow: 1, mb: { xs: 2, md: 0 } }}
                  error={inputProps.error}
                  helperText={inputProps.helperText}
                />
              )}
              onChange={handleNutrientSelectionChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              error={inputProps.error}
              helperText={inputProps.helperText}
              label="Amount"
              type="number"
              fullWidth
              sx={{ flexGrow: 1 }}
              onChange={handleNutrientAmountChange}
              InputProps={{
                inputProps: { min: 0 },
                endAdornment: (
                  <InputAdornment position="end">
                    {unitOptions.find(
                      (u) => u.id === selectedNutrient?.preferredUnitId
                    )?.abbreviation ?? ""}
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
