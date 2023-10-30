"use client";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { ReactNode } from "react";

interface MUIThemeProviderProps {
  children: ReactNode;
}

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export const MUIThemeProvider = ({ children }: MUIThemeProviderProps) => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
