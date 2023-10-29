import { AppBar, Box, Toolbar, Typography } from "@mui/material";

export const TopAppBar = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            NutriNova
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
