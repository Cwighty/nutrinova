import { Box, Button, InputAdornment, TextField } from "@mui/material";
import { Search } from "@mui/icons-material";
import React, { ChangeEventHandler } from "react";
import { NextLinkComposed } from "@/components/Link";

interface MyRecipesSearchFormProps {
  setSearchTerm: (searchTerm: string) => void;
}

export const MyRecipesSearchForm = ({
  setSearchTerm,
}: MyRecipesSearchFormProps) => {
  const handleSearchTermChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearchTerm(e.target.value);
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
        onChange={handleSearchTermChange}
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
      <Button
        component={NextLinkComposed}
        to={{ pathname: "/recipes/create" }}
        variant="contained"
        color="primary"
      >
        Create Recipe
      </Button>
    </Box>
  );
};
