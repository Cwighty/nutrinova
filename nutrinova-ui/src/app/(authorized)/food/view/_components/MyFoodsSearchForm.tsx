"use client";
import { Box, InputAdornment, TextField } from "@mui/material";
import { Search } from "@mui/icons-material";
import React from "react";
import { NutrientOption } from "@/app/(authorized)/food/_models/nutrientOption";
import { SearchParameters } from "../page";
import NutrientFilterOptions from "@/components/forms/NutrientFilterOptions";


interface MyFoodSearchFormProps {
  setSearchParameters: (searchParameters: SearchParameters) => void;
  currentSearchParameters: SearchParameters;
}

export const MyFoodSearchForm = ({
  setSearchParameters,
  currentSearchParameters,
}: MyFoodSearchFormProps) => {
  const handleSearchParametersChange = (
    value: string | number | NutrientOption | null | undefined,
    targetProperty: string,
  ) => {
    console.log("handleSearchParametersChange", value, targetProperty);
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
        onChange={(e) =>
          handleSearchParametersChange(e.target.value, "foodSearchTerm")
        }
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

      <NutrientFilterOptions
        onSelectedNutrientChange={(n) =>
          handleSearchParametersChange(n, "nutrientSearchTerm")
        }
        onNutrientAmountChange={(a) =>
          handleSearchParametersChange(a, "nutrientValue")
        }
        onComparisonOperatorChange={(c) =>
          handleSearchParametersChange(c, "comparisonOperator")
        }
      />
    </Box>
  );
};
