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

export interface PageBarProps {
  title: string;
}

export default function PageBar({ title }: PageBarProps) {
  return (
    <AppBar position="static" elevation={0}>
      <Container maxWidth={false}>
        <Toolbar disableGutters>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>

          <Box sx={{ flexGrow: 0 }}>
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
