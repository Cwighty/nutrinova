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
import { useTheme } from "@/context/ThemeContext";

export interface PageBarProps {
  title: string;
}

export default function PageBar({ title }: PageBarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <AppBar position="static" elevation={0}>
      <Container maxWidth={false}>
        <Toolbar disableGutters>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>

          <Box sx={{ flexGrow: 0 }}>
            <IconButton onClick={toggleTheme} sx={{ mr: 2 }}>
              {theme === "light" ? <Brightness7 /> : <Brightness4 />}
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
