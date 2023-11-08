"use client";
import { Grid, InputAdornment, TextField } from "@mui/material";
import { Search } from "@mui/icons-material";
import React, { useEffect } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { useGetAllFoodForUserQuery } from "@/app/(authorized)/food/foodHooks";

interface MyFoodSearchFormProps {
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
}

export const MyFoodSearchForm = ({
  searchTerm,
  setSearchTerm,
}: MyFoodSearchFormProps) => {
  const foodName = useDebounce(searchTerm, 500);

  const query = useGetAllFoodForUserQuery(foodName);

  useEffect(() => {
    if (foodName === "" || foodName === undefined) {
      return;
    }
    const fetchFoods = async () => {
      await query.refetch();
    };

    fetchFoods().catch(console.error);
  }, [foodName, query]);
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <TextField
          onChange={(e) => setSearchTerm(e.target.value)}
          label="Food Name"
          placeholder="Search my foods"
          fullWidth
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        ></TextField>
      </Grid>

      <Grid item xs={12} md={3}>
        <TextField
          label="Serving Size"
          type="number"
          fullWidth
          margin="normal"
        />
      </Grid>

      <Grid item xs={12} md={3}>
        <TextField label="Unit" fullWidth margin="normal" />
      </Grid>
    </Grid>
  );
};
