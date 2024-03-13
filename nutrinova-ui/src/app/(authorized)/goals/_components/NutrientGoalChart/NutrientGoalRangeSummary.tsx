"use client";

import { Box, Grid, Paper, Skeleton, Stack, Typography, } from "@mui/material";
import { NutrientGoalReportItem } from "../../_models/NutrientGoalReportItem";
import { ProgressSummaryCard } from "./ProgressSummaryCard";
import { Star, Timeline } from "@mui/icons-material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import React from "react";
import { useFetchGoalReportByNutrient } from "../../goalHooks";
import { PatientContext } from "@/components/providers/PatientProvider";
import { NutrientGoalChart } from "./NutrientGoalChart";

interface NutrientGoalRangeSummaryProps {
  selectedNutrient: NutrientGoalReportItem | null;
}

export const NutrientGoalRangeSummary: React.FC<NutrientGoalRangeSummaryProps> = ({
  selectedNutrient
}) => {
  const [fromDate, setFromDate] = React.useState<Date>(new Date());
  const [toDate, setToDate] = React.useState<Date>(new Date());

  const patientContext = React.useContext(PatientContext);
  const patient = patientContext?.selectedPatient;

  const reportData = useFetchGoalReportByNutrient(fromDate, toDate, selectedNutrient?.nutrientId || 0, patient?.id || "");
  const report = reportData.data?.patientReports[0];

  return (
    <>
      <Paper elevation={3} sx={{ padding: 2 }}>
        <Grid container>
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
            <Stack spacing={2} direction={"row"} alignItems={"center"}>
              <Typography variant="h6">{selectedNutrient?.nutrientName}</Typography>
              <Box>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="From Date"
                    value={fromDate}
                    onChange={(e: Date | null) => setFromDate(e as Date)}
                  />
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="To Date"
                    value={toDate}
                    onChange={(e: Date | null) => setToDate(e as Date)}
                  />
                </LocalizationProvider>
              </Box>
            </Stack>
          </Grid>
          <Grid item xs={12} lg={8}>
            {reportData.isLoading && <Skeleton sx={{ height: 1 }} />}
            {report &&
              <NutrientGoalChart report={report} />
            }
          </Grid>
          <Grid item xs={12} lg={4}>
            {reportData.isLoading &&
              <Stack spacing={0}>
                <Typography variant="h6">Progress</Typography>
                <Skeleton sx={{ height: 100 }} />
                <Skeleton sx={{ height: 100 }} />
                <Skeleton sx={{ height: 100 }} />
              </Stack>
            }
            {report &&
              <Stack spacing={2}>
                <Typography variant="h6">Progress</Typography>
                <ProgressSummaryCard title="Days Achieved" summaryValue={`${report.daysAchievedCount}/${report.days.length}`} visualContent={<Typography sx={{ fontSize: "3em" }}>{Math.round(report.daysAchievedCount / report.days.length)}%</Typography>} cardColor="success.main" />
                <ProgressSummaryCard title="Best Day" summaryValue={`${Math.round(report.maxConsumption * 100) / 100} ${selectedNutrient?.preferredUnit.abbreviation}`} visualContent={<Star sx={{ fontSize: "4em" }} />} cardColor="warning.main" />
                <ProgressSummaryCard title="Avg. Consumption" summaryValue={`${Math.round(report.avgConsumption * 100) / 100} ${selectedNutrient?.preferredUnit.abbreviation}`} visualContent={<Timeline sx={{ fontSize: "4em" }} />} cardColor="info.main" />
              </Stack>
            }
          </Grid>
        </Grid>
      </Paper >
    </>
  );
};
