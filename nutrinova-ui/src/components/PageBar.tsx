"use client";
import {
  AppBar,
  Box,
  Container,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { DarkMode, WbSunny } from "@mui/icons-material";
import { useTheme } from "@/context/ThemeContext";
import { PatientSelector } from "@/app/(authorized)/patients/_components/PatientSelector";

export interface PageBarProps {
  title: string;
  isPatientContext?: boolean;
}

export default function PageBar({ title, isPatientContext = false }: PageBarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <AppBar color="transparent" position="static" elevation={0}>
      <Container maxWidth={false}>
        <Toolbar disableGutters>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>

          <Box sx={{ flexGrow: 0 }}>
            <IconButton onClick={toggleTheme} sx={{ mr: 2 }}>
              {theme === "dark" ? <WbSunny /> : <DarkMode />}
            </IconButton>
            {isPatientContext && (
              <Tooltip title="Select a Patient">
                <PatientSelector />
              </Tooltip>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
