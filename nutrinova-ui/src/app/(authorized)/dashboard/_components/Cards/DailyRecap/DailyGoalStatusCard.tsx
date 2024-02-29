import React from 'react';
import { Box, Typography, Paper, useTheme, Grid, Button } from '@mui/material';
import { NutrientGoalReportItem, NutrientGoalStatus } from '@/app/(authorized)/goals/_models/NutrientGoalReportItem';
import { CheckBoxOutlined } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

export interface DailyGoalStatusCardProps {
  nutrients: NutrientGoalReportItem[];
}

export const DailyGoalStatusCard: React.FC<DailyGoalStatusCardProps> = ({
  nutrients
}) => {
  const theme = useTheme();
  const router = useRouter();

  const totalAcheived = nutrients.filter(n => n.goalStatus === NutrientGoalStatus.Met).length;
  const totalGoals = nutrients.length;
  const progressMessage = `${totalAcheived} of ${totalGoals} Goals Achieved`;


  return (
    <Paper elevation={3} sx={{ padding: 1, my: 2, backgroundColor: theme.palette.grey[900] }}>
      <Grid container spacing={0} justifyContent="space-between">
        <Grid item>
          <Grid container>
            <Box color={theme.palette.success.main}>
              <CheckBoxOutlined />
            </Box>
            <Box sx={{ marginLeft: 1 }}>
              <Typography variant="body1" color="white" fontWeight="bold">
                {progressMessage}
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Grid item>
          <Box>
            <Button color="primary" size="small" onClick={() => router.push("/goals")}>View Goals</Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};
