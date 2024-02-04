"use client"

import { Alert, Skeleton } from '@mui/material';
import { useFetchGoalReport } from '../../goalHooks';
import { PatientGoalsDataGrid } from './PatientGoalsDataGrid';
import React from 'react';

export const AllPatientGoals = () => {
  const [today] = React.useState(new Date(Date.now()));
  const { data, isLoading, isError } = useFetchGoalReport({ beginDate: today, endDate: today });

  if (isLoading) {
    return <Skeleton variant="rectangular" width="100%" height={400} />;
  }

  if (isError) {
    return <Alert severity="error">An error occurred while fetching the goals.</Alert>;
  }

  return (
    <div>
      {data && data.map((report) => (
        <PatientGoalsDataGrid key={report.patientId} report={report} />
      ))}
    </div>
  );

};