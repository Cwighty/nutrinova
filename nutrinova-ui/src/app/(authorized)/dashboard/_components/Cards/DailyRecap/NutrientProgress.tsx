import React from 'react';
import { Box, Typography, Paper, LinearProgress, useTheme, Grid, } from '@mui/material';
import { NutrientProgressProps } from './NutrientProgressProps';
import { WarningAmberOutlined } from '@mui/icons-material';

const NutrientProgress: React.FC<NutrientProgressProps> = ({
  nutrientName,
  consumedAmount,
  targetAmount,
  unit,
}) => {
  const theme = useTheme();
  const percentage = (consumedAmount / targetAmount.LowerLimit) * 100;
  const isOverLimit = consumedAmount > targetAmount.LowerLimit;
  const progressColor = isOverLimit ? theme.palette.warning.main : theme.palette.primary.main;

  return (
    <Paper elevation={3} sx={{ padding: 1, backgroundColor: theme.palette.grey[900] }}>
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <Typography variant="caption" color="white" fontWeight="bold">
            {nutrientName}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between">
            <Box fontWeight="bold" fontSize="2em" color={progressColor}>
              {consumedAmount} {unit} {" "}
              <Typography variant="caption" color="white" fontSize=".5em">
                /{targetAmount.LowerLimit} {unit}
              </Typography>
            </Box>
            <Box color={progressColor}>
              <WarningAmberOutlined sx={{ fontSize: "2.5em" }} />
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" alignItems="center">
            <Box width="100%" mr={1}>
              <LinearProgress
                variant="determinate"
                value={percentage}
                sx={{
                  backgroundColor: theme.palette.grey[800],
                  height: 10,
                  borderRadius: 5,
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 5,
                    backgroundColor: progressColor,
                  },
                }}
              />
            </Box>
            <Typography variant="body2" color="white">
              {percentage}%
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default NutrientProgress;
