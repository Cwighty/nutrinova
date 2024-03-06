"use client";

import { Box, Paper, Typography, useTheme } from "@mui/material";

interface ProgressSummaryProps {
  title: string;
  summaryValue: string;
  visualContent: React.ReactNode;
  cardColor: string;
}

export const ProgressSummaryCard: React.FC<ProgressSummaryProps> = ({
  title,
  summaryValue,
  visualContent,
  cardColor,
}) => {
  const theme = useTheme();

  return (
    <>
      <Paper elevation={3} sx={{ padding: 0, backgroundColor: theme.palette.grey[900] }}>
        <Box sx={{ borderLeft: 7, borderColor: cardColor, p: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-around", alignItems: "center", width: "100%" }}>
            <Box>
              <Box sx={{}}>{title}</Box>
              <Box sx={{ fontSize: "1.5em" }}>{summaryValue}</Box>
            </Box>
            <Box>
              <Typography sx={{ color: cardColor }}>
                {visualContent}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
    </>
  );
};

