"use client";
import { Search } from "@mui/icons-material";
import { Box, InputAdornment, MenuItem, TextField } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { UsdaFoodDivisionOption } from "./page";
import { useRouter } from "next/navigation";
import { useDebounce } from "@uidotdev/usehooks";

interface FoodSearchFormProps {
  usdaFoodDivisionOptions: UsdaFoodDivisionOption[];
}

export default function FoodSearchForm({
  usdaFoodDivisionOptions,
}: FoodSearchFormProps) {
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const queryKeyword = useDebounce(searchKeyword, 500);
  const [selectedFoodDivision, setSelectedFoodDivision] = useState<string>(
    usdaFoodDivisionOptions[0].name
  );
  const [selectedFoodCategory, setSelectedFoodCategory] =
    useState<string>("All");

  const router = useRouter();

  const handleDivisionChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSelectedFoodDivision(e.target.value);
    setSelectedFoodCategory("All");
  };

  const handleCategoryChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSelectedFoodCategory(e.target.value);
  };

  const handleKeywordChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSearchKeyword(e.target.value);
  };

  useEffect(() => {
    router.push(
      "/food/search?" +
        new URLSearchParams({
          queryKeyword,
          selectedFoodDivision,
          selectedFoodCategory,
        }).toString()
    );
  }, [queryKeyword, selectedFoodDivision, selectedFoodCategory, router]);

  return (
    <>
      <TextField
        fullWidth
        label="Search"
        variant="outlined"
        placeholder="Buttered toast"
        sx={{ my: 2 }}
        onChange={handleKeywordChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      />

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <TextField
          label="USDA Food Division"
          variant="outlined"
          fullWidth
          select
          value={selectedFoodDivision}
          onChange={handleDivisionChange}
          sx={{ my: 2 }}
        >
          {usdaFoodDivisionOptions.map((option) => (
            <MenuItem key={option.name} value={option.name}>
              {option.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Type"
          variant="outlined"
          fullWidth
          select
          value={selectedFoodCategory}
          onChange={handleCategoryChange}
          sx={{ my: 2 }}
        >
          <MenuItem value="All">All</MenuItem>
          {selectedFoodDivision &&
            usdaFoodDivisionOptions.map((option) => {
              if (option.name === selectedFoodDivision) {
                return option.categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ));
              }
            })}
        </TextField>
      </Box>
    </>
  );
}
