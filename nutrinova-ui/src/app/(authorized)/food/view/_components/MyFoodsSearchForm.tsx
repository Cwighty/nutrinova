"use client";
import { Box, InputAdornment, TextField } from "@mui/material";
import { Search } from "@mui/icons-material";
import React, { useState } from "react";
import SelectNutrient from "@/components/forms/SelectNutrient";
import { NutrientOption } from "@/app/(authorized)/food/_models/nutrientOption";
import { useGetAllFoodForUserQuery } from "@/app/(authorized)/food/foodHooks";

interface MyFoodSearchFormProps {
  setSearchTerm: (searchTerm: string) => void;
}

export const MyFoodSearchForm = ({ setSearchTerm }: MyFoodSearchFormProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedNutrient, setSelectedNutrient] =
    useState<NutrientOption | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  const handleNutrientSelectionChange = (nutrient: NutrientOption | null) => {
    setSelectedNutrient(nutrient);
  };

  const handleNutrientAmountChange = (amount: number | null) => {
    setSelectedAmount(amount);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "space-between",
      }}
    >
      <TextField
        onChange={(e) => setSearchTerm(e.target.value)}
        label="Food Name"
        placeholder="Search my foods"
        margin="normal"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      />

      <SelectNutrient
        onSelectedNutrientChange={handleNutrientSelectionChange}
        onNutrientAmountChange={handleNutrientAmountChange}
      />
    </Box>
  );
};
