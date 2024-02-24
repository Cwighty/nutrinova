"use client";
import React from "react";
import GenericCard from "../GenericCard";
import { CreatePatientNutrientGoalModal } from "@/components/forms/CreatePatientNutrientGoalModal";
import { NutrientGoalRequestModel } from "@/app/(authorized)/goals/_models/NutrientGoalRequestModel";
import { PatientContext } from "@/components/providers/PatientProvider";
import {
  useCreateGoal,
  // useFetchGoalReport,
} from "@/app/(authorized)/goals/goalHooks";
import { NutrientGoalReportItem } from "@/app/(authorized)/goals/_models/NutrientGoalReportItem";
import { Box, Typography } from "@mui/material";
import NutrientProgress from "./NutrientProgress";

const DailyRecapCard: React.FC = () => {
  // const [today] = React.useState(new Date(Date.now()));
  const patientContext = React.useContext(PatientContext);
  const patient = patientContext?.selectedPatient;
  // const { data: reportData, isLoading: reportDataLoading } = useFetchGoalReport(
  //   { beginDate: today, endDate: today }
  // );

  const sampleNutrientGoalReportItem: NutrientGoalReportItem = {
    nutrientId: 1,
    nutrientName: "Protein",
    preferredUnit: {
      id: 1,
      description: "Grams",
      abbreviation: "g",
      categoryId: 1,
      category: { id: 1, description: "Weight" },
    },
    customTargetAmount: {
      LowerLimit: 0,
      UpperLimit: 100,
      MaxLimit: 200,
      Type: "Custom",
    },
    recommendedTargetAmount: {
      LowerLimit: 0,
      UpperLimit: 100,
      MaxLimit: 200,
      Type: "Recommended",
    },
    consumedAmount: 50,
    goalStatus: 0,
  };

  const reportData = [
    {
      patientId: "1",
      nutrientGoalReportItems: [
        sampleNutrientGoalReportItem,
      ]
    },
  ];

  // const selectedPatientReport = reportData?.filter(
  //   (r) => r.patientId === patient?.id
  // )[0];
  const selectedPatientReport = reportData[0];

  const nutrients: NutrientGoalReportItem[] =
    selectedPatientReport?.nutrientGoalReportItems ?? [];

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
        {/* {reportDataLoading && <Skeleton variant="rectangular" height={200} />} */}
        {reportData && nutrients && nutrients.length === 0 && (
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
