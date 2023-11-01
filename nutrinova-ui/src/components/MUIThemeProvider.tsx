"use client";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { ReactNode, useEffect, useState } from "react";

interface MUIThemeProviderProps {
  children: ReactNode;
}

export const MUIThemeProvider = ({ children }: MUIThemeProviderProps) => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  useEffect(() => {
    setTheme(localStorage.getItem("theme") || "dark");
  }, []);

  const muiTheme = createTheme({
    palette: {
      mode: theme as "light" | "dark",
    },
  });

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
