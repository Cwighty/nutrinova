import { Typography } from "@mui/material";
import React from "react";

export const NoFoodRowsOverlay = () => {
  return (
    <Typography
      variant="h5"
      sx={{ textAlign: "center", alignItems: "center", pt: 2 }}
    >
      No foods found
    </Typography>
  );
};
