"use client";
import React from "react";
import { CreatePatientNutrientGoalModal } from "@/app/(authorized)/goals/CreatePatientNutrientGoalModal";
import { NutrientGoalRequestModel } from "@/app/(authorized)/goals/_models/NutrientGoalRequestModel";
import { PatientContext } from "@/components/providers/PatientProvider";
import {
  useCreateGoal, useFetchGoalReport,
  // useFetchGoalReport,
} from "@/app/(authorized)/goals/goalHooks";
import { NutrientGoalReportItem } from "@/app/(authorized)/goals/_models/NutrientGoalReportItem";
import { Box, Grid, Skeleton, Typography } from "@mui/material";
import NutrientProgress from "./NutrientProgress";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

export const DailyNutrientCarouselSelector: React.FC = () => {
  const [today] = React.useState(new Date(Date.now()));
  const patientContext = React.useContext(PatientContext);
  const patient = patientContext?.selectedPatient;
  const { data: report, isLoading: reportDataLoading } = useFetchGoalReport(
    { beginDate: today, endDate: today },
  );

  const selectedPatientReport = report?.patientReports.find((p) => p.patientId === patient?.id);

  const nutrients: NutrientGoalReportItem[] =
    selectedPatientReport?.days[0].nutrientGoalReportItems ?? [];

  const defaultGoal: NutrientGoalRequestModel = {
    nutrientId: 0,
    patientId: "",
    useRecommended: true,
  };
  const [newGoal, setNewGoal] =
    React.useState<NutrientGoalRequestModel>(defaultGoal);
  const createGoalMutation = useCreateGoal();
  const handleSubmit = (): void => {
    if (patient) {
      createGoalMutation.mutate(newGoal);
    }
  };

  const chevronStyle = {
    my: "auto",
    fontSize: "2.5em",
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "row" }}>
      <ChevronLeft sx={chevronStyle} />
      <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "nowrap", overflowX: "auto", py: 2 }}>
        {reportDataLoading && <Skeleton variant="rectangular" height={200} />}
        {(report?.daysCount == 0 || (selectedPatientReport && nutrients && nutrients.length === 0))
          ? (
            <Box>
              {patient && (
                <CreatePatientNutrientGoalModal
                  handleSubmit={handleSubmit}
                  newGoal={newGoal}
                  setNewGoal={setNewGoal}
                  selectedPatient={patient}
                />
              )}
              <Typography variant="overline">No Goals</Typography>
              <br />
              <Typography variant="body1" color={"text.secondary"}>
                Set a nutrient goal above to track your progress.
              </Typography>
            </Box>
          )
          :
          (
            <>
              {selectedPatientReport && nutrients &&
                nutrients.length > 0 &&
                nutrients.map((nutrient) => (
                  <Box key={nutrient.nutrientId} sx={{ mx: 1, maxWidth: 350, minWidth: 300 }}>
                    <NutrientProgress
                      key={nutrient.nutrientId}
                      nutrientName={nutrient.nutrientName}
                      consumedAmount={nutrient.consumedAmount}
                      targetAmount={nutrient.customTargetAmount}
                      status={nutrient.goalStatus}
                      unit={nutrient.preferredUnit?.abbreviation}
                    />
                  </Box>
                ))}
            </>
          )
        }
      </Box>
      <ChevronRight sx={chevronStyle} />
    </Box>
  )
};
