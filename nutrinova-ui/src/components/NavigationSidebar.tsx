"use client";
import { NavigationList } from "@/components/NavigationList";
import { Box } from "@mui/material";

export const NavigationSidebar = () => {
  return (
    <Box sx={{ display: { xs: "none", md: "flex" } }}>
      <NavigationList />
    </Box>
  );
};
