"use client";

import { UnitOption } from "@/app/(authorized)/food/_models/unitOption";
import { useGetUnitsQuery } from "@/app/(authorized)/food/foodHooks";
import { Alert, Autocomplete, Skeleton, TextField } from "@mui/material";
import { SyntheticEvent } from "react";

interface SelectUnitProps {
  value: UnitOption | null;
  useAbbreviation?: boolean;
  error?: boolean;
  helperText?: string;
  restrictToCategory?: string | null;
  onSelectedUnitChange: (unit: UnitOption | null) => void;
}

export default function SelectUnit({
  onSelectedUnitChange,
  error,
  helperText,
  useAbbreviation = false,
  value,
  restrictToCategory = null,
}: SelectUnitProps) {
  const {
    data: unitOptions,
    isLoading: unitOptionsLoading,
    isError: unitOptionsIsError,
  } = useGetUnitsQuery();

  const filteredOptions = restrictToCategory === null ? unitOptions : unitOptions?.filter(
    (option) => option.category === restrictToCategory
  );
  const handleSelectionChanged = (
    _: SyntheticEvent<Element, Event>,
    value: UnitOption | null
  ) => {
    onSelectedUnitChange(value);
  };
  if (unitOptionsLoading) {
    return (
      <Skeleton variant="rounded" sx={{ mt: 2 }} width={"auto"} height={40} />
    );
  }
  if (unitOptionsIsError) {
    return (
      <Alert severity="error">
        Error loading unit options, try again later
      </Alert>
    );
  }

  return (
    <>
      {unitOptions && (
        <Autocomplete
          value={value}
          options={filteredOptions ?? []}
          groupBy={(option) => option.category}
          getOptionLabel={(option) =>
            `${useAbbreviation ? option.abbreviation : option.description}`
          }
          renderOption={(props, option) => {
            return (
              <li {...props} key={option.id}>
                {useAbbreviation ? option.abbreviation : option.description}
              </li>
            );
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Unit"
              fullWidth
              margin="normal"
              error={error}
              helperText={helperText}
            />
          )}
          onChange={handleSelectionChanged}
        />
      )}
    </>
  );
}
