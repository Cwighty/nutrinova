"use client";
import { Search } from "@mui/icons-material";
import { Box, InputAdornment, MenuItem, TextField } from "@mui/material";
import { ChangeEvent } from "react";
import { FoodSearchFilterParams } from "../../_models/foodSearchFilterParams";

interface FoodSearchFormProps {
  filterParams: FoodSearchFilterParams;
  setFilterParams: (FoodSearchFilterParams: FoodSearchFilterParams) => void;
  searchKeyword: string;
  setSearchKeyword: (searchKeyword: string) => void;
}

const usdaFilterOptions: string[] = [
  "Foundation",
  "Branded",
  "SR Legacy",
  "Survey (FNDDS)",
  "Experimental",
];

export default function FoodSearchForm({ filterParams, setFilterParams, searchKeyword, setSearchKeyword }: FoodSearchFormProps) {

  const handleDivisionChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFilterParams({
      ...filterParams,
      filterOption: e.target.value,
    });
  };


  return (
    <>
      <TextField
        fullWidth
        label="Search"
        variant="outlined"
        placeholder="Buttered toast"
        value={searchKeyword}
        onChange={(e) => {
          setSearchKeyword(e.target.value);
        }
        }
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      />

      <Box
        sx={(theme) => ({
          [theme.breakpoints.down("md")]: {
            display: "flex",
            justifyContent: "space-between",
          },
        })}
      >
        <TextField
          label="Brand Owner"
          variant="outlined"
          fullWidth
          select
          value={filterParams.filterOption}
          onChange={handleDivisionChange}
          sx={{ my: 2 }}
        >
          {usdaFilterOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </Box>
    </>
  );
}
