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
  InputAdornment,
  MenuItem,
  Select,
  Skeleton,
  TextField,
} from "@mui/material";
import React, { SyntheticEvent, useState } from "react";

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

const SelectNutrient = ({ error, helperText, canCompare = false, onComparisonOperatorChange, onNutrientAmountChange, onSelectedNutrientChange }: SelectNutrientProps) => {
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


  const handleComparisonOperatorChange = (value: string) => {
    setComparisonOperator(value);
    onComparisonOperatorChange(value);
  };


  const handleNutrientAmountChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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
        <Box display={"flex"} alignItems={"center"}>
          <Autocomplete
            options={nutrientOptions}
            getOptionLabel={(option) => `${option.id} ${option.nutrientName}`}
            sx={{ flexGrow: 1 }}
            renderOption={(props, option) => {
              return (
                <li {...props} key={option.id}>
                  {option.nutrientName}
                </li>
              );
            }}
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
          {canCompare &&
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={comparisonOperator}
              label="Age"
              onChange={() => handleComparisonOperatorChange(comparisonOperator)}
            >
              {COMPARISON_OPERATOR_OPTIONS.map((option) => (
                <MenuItem key={option.id} value={option.abbreviation} > {option.name} </MenuItem>))}
            </Select>
          }

          <TextField
            error={error}
            helperText={helperText}
            label="Amount"
            type="number"
            sx={{ width: "50%", ml: 2 }}
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
        </Box >
      )}
    </>
  );
};

export default SelectNutrient;
