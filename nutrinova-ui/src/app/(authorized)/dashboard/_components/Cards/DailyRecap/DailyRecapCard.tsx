"use client";
import React from "react";
import GenericCard from "../GenericCard";
import { CreatePatientNutrientGoalModal } from "@/components/forms/CreatePatientNutrientGoalModal";
import { NutrientGoalRequestModel } from "@/app/(authorized)/goals/_models/NutrientGoalRequestModel";
import { PatientContext } from "@/components/providers/PatientProvider";
import {
  useCreateGoal, useFetchGoalReport,
  // useFetchGoalReport,
} from "@/app/(authorized)/goals/goalHooks";
import { NutrientGoalReportItem } from "@/app/(authorized)/goals/_models/NutrientGoalReportItem";
import { Box, Skeleton, Typography } from "@mui/material";
import NutrientProgress from "./NutrientProgress";

const DailyRecapCard: React.FC = () => {
  const [today] = React.useState(new Date(Date.now()));
  const patientContext = React.useContext(PatientContext);
  const patient = patientContext?.selectedPatient;
  console.log(patient);
  const { data: report, isLoading: reportDataLoading } = useFetchGoalReport(
    { beginDate: today, endDate: today },
  );

  const selectedPatientReport = report?.patientReports.filter(
    (r) => r.patientId === patient?.id
  )[0];

  const nutrients: NutrientGoalReportItem[] =
    selectedPatientReport?.days ?? [];

  const defaultGoal: NutrientGoalRequestModel = {
    nutrientId: 0,
    patientId: "",
    dailyGoalAmount: 0,
  };
  const [newGoal, setNewGoal] =
    React.useState<NutrientGoalRequestModel>(defaultGoal);
  const createGoalMutation = useCreateGoal();
  const handleSubmit = (): void => {
    if (patient) {
      createGoalMutation.mutate(newGoal);
    }
  };

  const actionButton = (
    <>
      {patient && (
        <CreatePatientNutrientGoalModal
          handleSubmit={handleSubmit}
          newGoal={newGoal}
          setNewGoal={setNewGoal}
          selectedPatient={patient}
        />
      )}
    </>
  );

  return (
    <>
      <GenericCard title="Daily Recap" actions={actionButton}>
        {reportDataLoading && <Skeleton variant="rectangular" height={200} />}
        {(report?.daysCount == 0 || (selectedPatientReport && nutrients && nutrients.length === 0)) && (
          <Box>
            <Typography variant="body1">
              Set a nutrient goal above to track your progress.
            </Typography>
          </Box>
        )}
        {nutrients &&
          nutrients.length > 0 &&
          nutrients.map((nutrient) => (
            <NutrientProgress
              key={nutrient.nutrientId}
              nutrientName={nutrient.nutrientName}
              consumedAmount={nutrient.consumedAmount}
              targetAmount={nutrient.customTargetAmount}
              status={nutrient.goalStatus}
              unit={nutrient.preferredUnit.abbreviation}
            />
          ))}
      </GenericCard>
    </>
  );
};

export default DailyRecapCard;
