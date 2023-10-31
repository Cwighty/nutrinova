"use client";
import { Search } from "@mui/icons-material";
import { Box, InputAdornment, MenuItem, TextField } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@uidotdev/usehooks";

interface FoodSearchFormProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const usdaFilterOptions: string[] = [
  "Foundation",
  "Branded",
  "SR Legacy",
  "Survey (FNDDS)",
  "Experimental",
];

export default function FoodSearchForm({
  searchParams
}: FoodSearchFormProps) {
  const [searchKeyword, setSearchKeyword] = useState<string>(searchParams["foodName"] as string);
  const foodName = useDebounce(searchKeyword, 500);
  const [usdaFilterOption, setUsdaFilterOption] = useState<string>(
    searchParams["usdaFilterOption"] as string ?? usdaFilterOptions[0]
  );

  const router = useRouter();

  const handleDivisionChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setUsdaFilterOption(e.target.value);
  };

  const handleKeywordChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSearchKeyword(e.target.value);
  };

  useEffect(() => {
    if (foodName === "") {
      return;
    }
    router.push(
      "/food/search?" +
      new URLSearchParams({
        foodName,
        usdaFilterOption,
      }).toString()
    );
  }, [foodName, usdaFilterOption, router]);

  return (
    <>
      <TextField
        fullWidth
        label="Search"
        variant="outlined"
        placeholder="Buttered toast"
        sx={{ mb: 2 }}
        value={searchKeyword}
        onChange={handleKeywordChange}
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
          value={usdaFilterOption}
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
