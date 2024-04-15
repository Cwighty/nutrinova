import React from 'react';
import { Box, Typography, Paper, LinearProgress, useTheme, Grid, } from '@mui/material';
import { NutrientProgressProps } from './NutrientProgressProps';
import { CheckBoxOutlined, PendingOutlined, WarningAmberOutlined } from '@mui/icons-material';
import { NutrientGoalStatus } from '@/app/(authorized)/goals/_models/NutrientGoalReportItem';

const NutrientProgress: React.FC<NutrientProgressProps> = ({
  nutrientName,
  consumedAmount,
  targetAmount,
  unit,
  status,
}) => {
  const theme = useTheme();
  const goalValue = targetAmount.lowerLimit ? targetAmount.lowerLimit : targetAmount.upperLimit;
  const percentage = Math.round(goalValue ? (consumedAmount / goalValue) * 100 : 0);

  let progressColor;
  switch (status) {
    case NutrientGoalStatus.Exceeded:
      progressColor = theme.palette.warning.main;
      break;
    case NutrientGoalStatus.Met:
      progressColor = theme.palette.success.main;
      break;
    default:
      progressColor = theme.palette.info.main;
  }

  const ProgressIcon = status === NutrientGoalStatus.Met ? CheckBoxOutlined
    : status === NutrientGoalStatus.Exceeded ? WarningAmberOutlined
      : PendingOutlined;

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
              {parseFloat(consumedAmount.toFixed(2))} {unit} {" "}
              <Typography variant="caption" color="white" fontSize=".5em">
                /{goalValue} {unit}
              </Typography>
            </Box>
            <Box color={progressColor} >
              <ProgressIcon sx={{ fontSize: "2.5em" }} />
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" alignItems="center">
            <Box width="100%" mr={1}>
              <LinearProgress
                variant="determinate"
                value={percentage < 100 ? percentage : 100}
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
