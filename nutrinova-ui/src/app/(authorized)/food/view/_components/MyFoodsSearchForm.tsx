import { Grid, InputAdornment, TextField } from "@mui/material";
import { Search } from "@mui/icons-material";
import React from "react";

export const MyFoodSearchForm = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <TextField
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
