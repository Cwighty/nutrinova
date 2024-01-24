"use client";
import {
  AppBar,
  Box,
  Container,
  IconButton,
  Skeleton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { DarkMode, WbSunny } from "@mui/icons-material";
import { useTheme } from "@/context/ThemeContext";
import { PatientSelector } from "@/app/(authorized)/patients/_components/PatientSelector";
import { useGetCustomer } from "../services/hooks/customerHooks";

export interface PageBarProps {
  title: string;
  isPatientContext?: boolean;
}

export default function PageBar({ title }: PageBarProps) {
  const { theme, toggleTheme } = useTheme();
  const { data: customer } = useGetCustomer();
  if (!customer) { return <Skeleton></Skeleton> } else { console.log("this is the customer that you are looking for", customer) }
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
            {!customer?.issingleuser && (
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
