'use client'

import { UnitOption } from "@/app/(authorized)/food/_models/unitOption";
import { useGetUnitsQuery } from "@/app/(authorized)/food/foodHooks";
import { Alert, Autocomplete, Skeleton, TextField } from "@mui/material";
import { SyntheticEvent } from "react";

interface SelectUnitProps {
  value: UnitOption | null;
  useAbreviation?: boolean;
  error?: boolean;
  helperText?: string;
  onSelectedUnitChange: (unit: UnitOption | null) => void;
}

export default function SelectUnit({ onSelectedUnitChange, error, helperText, useAbreviation = false, value }: SelectUnitProps) {
  const { data: unitOptions, isLoading: unitOptionsLoading, isError: unitOptionsIsError } = useGetUnitsQuery();

  const handleSelectionChanged = (_: SyntheticEvent<Element, Event>, value: UnitOption | null) => {
    onSelectedUnitChange(value);
  }
  if (unitOptionsLoading) {
    return (
      <Skeleton variant="rounded" sx={{ mt: 2 }} width={'auto'} height={40} />
    )
  }
  if (unitOptionsIsError) {
    return <Alert severity="error">Error loading unit options, try again later</Alert>;
  }

  return (<>
    {unitOptions && (

      <Autocomplete
        value={value}
        options={unitOptions}
        getOptionLabel={(option) => `${useAbreviation ? option.abreviation : option.description}`}
        renderOption={(props, option) => {
          return (
            <li {...props} key={option.id}>
              {useAbreviation ? option.abreviation : option.description}
            </li>
          );
        }}
        renderInput={(params) =>
          <TextField {...params}
            label="Unit"
            fullWidth
            margin="normal"
            error={error}
            helperText={helperText}
          />
        }
        onChange={handleSelectionChanged}
      />
    )}
  </>);
}