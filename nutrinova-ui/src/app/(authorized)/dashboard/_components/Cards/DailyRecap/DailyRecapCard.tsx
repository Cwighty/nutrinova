"use client";
import React from "react";
import GenericCard from "../GenericCard";
import { CreatePatientNutrientGoalModal } from "@/components/forms/CreatePatientNutrientGoalModal";
import { NutrientGoalRequestModel } from "@/app/(authorized)/goals/_models/NutrientGoalRequestModel";
import { PatientContext } from "@/components/providers/PatientProvider";
import {
  useCreateGoal,
  useFetchGoalReport,
} from "@/app/(authorized)/goals/goalHooks";
import { NutrientProgress } from "./NutrientProgress";
import { NutrientGoalReportItem } from "@/app/(authorized)/goals/_models/NutrientGoalReportItem";
import { Box, Typography } from "@mui/material";

const DailyRecapCard: React.FC = () => {
  const [today] = React.useState(new Date(Date.now()));
  const patientContext = React.useContext(PatientContext);
  const patient = patientContext?.selectedPatient;
  const { data: reportData, isLoading: reportDataLoading } = useFetchGoalReport(
    { beginDate: today, endDate: today }
  );

  const selectedPatientReport = reportData?.filter(
    (r) => r.patientId === patient?.id
  )[0];

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

  const getNutrientColor = (nutrientName: string): string => {
    // hash the nutrient name to get a color
    const colorPalette = [
      "#FA6977",
      "#F0B967",
      "#FAF278",
      "#9AE66E",
      "#87D5F8",
      "#CE81F8",
    ];
    const hash = nutrientName
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colorPalette[hash % colorPalette.length];
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
      {reportDataLoading && <div>Loading...</div>}
      <GenericCard title="Daily Recap" actions={actionButton}>
        {nutrients && nutrients.length === 0 && (
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
              label={nutrient.nutrientName}
              value={nutrient.consumedAmount}
              total={nutrient.dailyGoalAmount}
              unitAbbreviation={nutrient.preferredUnit?.abbreviation ?? ""}
              color={getNutrientColor(nutrient.nutrientName)}
            />
          ))}
      </GenericCard>
    </>
  );
};

export default DailyRecapCard;
