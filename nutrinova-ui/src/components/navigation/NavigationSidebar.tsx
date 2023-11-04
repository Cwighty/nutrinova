"use client";
import { NavigationList } from "@/components/navigation/NavigationList";
import { Paper } from "@mui/material";

export const NavigationSidebar = () => {
  return (
    <Paper
      elevation={3}
      sx={{
        display: { xs: "none", md: "flex" },
        height: "100vh",
        width: { md: 200, lg: 300 },
      }}
    >
      <NavigationList isDesktop />
    </Paper>
  );
};
