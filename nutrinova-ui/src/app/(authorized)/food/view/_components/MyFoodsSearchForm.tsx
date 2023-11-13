"use client";
import { Box, InputAdornment, TextField } from "@mui/material";
import { Search } from "@mui/icons-material";
import React from "react";
import SelectNutrient from "@/components/forms/SelectNutrient";
import { NutrientOption } from "@/app/(authorized)/food/_models/nutrientOption";
import { searchParameters } from "../page";

interface MyFoodSearchFormProps {
  setSearchParameters: (searchParameters: searchParameters) => void;
  currentSearchParameters: searchParameters;
}

export const MyFoodSearchForm = ({ setSearchParameters, currentSearchParameters }: MyFoodSearchFormProps) => {
  const handleSearchParemetersChange = (value: string | number | NutrientOption | null | undefined, targetProperty: string) => {
    setSearchParameters({
      ...currentSearchParameters,
      [targetProperty]: value,
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "space-between",
        gap: 2,
      }}
    >
      <TextField
        onChange={(e) => handleSearchParemetersChange(e.target.value, "foodSearchTerm")}
        label="Food Name"
        placeholder="Search my foods"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      />

      <SelectNutrient
        onSelectedNutrientChange={() => handleSearchParemetersChange(currentSearchParameters.nutrientSearchTerm, "nutrientSearchTerm")}
        onNutrientAmountChange={() => handleSearchParemetersChange(currentSearchParameters.nutrientValue, "nutrientValue")}
        onComparisonOperatorChange={() => handleSearchParemetersChange(currentSearchParameters.comparisonOperator, "comparisonOperator")}
        canCompare={true}
      />
    </Box>
  );
};
