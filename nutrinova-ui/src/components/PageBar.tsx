"use client";
import {
  AppBar,
  Avatar,
  Box,
  Container,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { useEffect, useState } from "react";

export interface PageBarProps {
  title: string;
}

export default function PageBar({ title }: PageBarProps) {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme !== "light";
  });

  useEffect(() => {
    const theme = darkMode ? "dark" : "light";
    localStorage.setItem("theme", theme);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <AppBar position="static" elevation={0}>
      <Container maxWidth={false}>
        <Toolbar disableGutters>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>

          <Box sx={{ flexGrow: 0 }}>
            <IconButton onClick={toggleDarkMode} sx={{ mr: 2 }}>
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
            <Tooltip title="Select a Patient">
              <IconButton sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
