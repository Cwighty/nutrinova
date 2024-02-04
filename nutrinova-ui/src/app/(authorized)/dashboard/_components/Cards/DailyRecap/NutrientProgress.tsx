"use client";
import React from "react";
import { LinearProgress, Box, Typography, Paper } from "@mui/material";
import { NutrientProgressProps } from "./NutrientProgressProps";

export const NutrientProgress: React.FC<NutrientProgressProps> = ({
  label,
  value,
  total,
  unitAbbreviation,
  color,
}) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
      <Paper
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "48px",
          height: "48px",
          color: "white",
          backgroundColor: color,
          borderRadius: "8px",
          mr: 1,
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
          {`${value}%`}
        </Typography>
      </Paper>
      <Box sx={{ flex: 1, mr: 1 }}>
        <Typography variant="body2" sx={{ minWidth: "100px" }}>
          {label}
        </Typography>
        <LinearProgress variant="determinate" value={value} />
      </Box>
      <Typography variant="body2">
        {total} {unitAbbreviation}
      </Typography>
    </Box>
  );
};
