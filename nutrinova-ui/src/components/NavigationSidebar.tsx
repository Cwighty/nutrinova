"use client";
import { NavigationList } from "@/components/NavigationList";
import { Paper } from "@mui/material";

export const NavigationSidebar = () => {
  return (
    <Paper
      sx={{
        display: { xs: "none", md: "flex" },
        height: "100vh",
        width: { md: 200, lg: 300 },
      }}
    >
      <NavigationList />
    </Paper>
  );
};
