import { Box, Typography } from "@mui/material";
import { AtomSpinner } from "@/components/atom-spinner/AtomSpinner";

export interface CenteredSpinnerProps {
  message?: string;
}

export default function CenteredSpinner({ message }: CenteredSpinnerProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <AtomSpinner />
      {message && (
        <Typography mt={2} variant="h6">
          {message}
        </Typography>
      )}
    </Box>
  );
}
