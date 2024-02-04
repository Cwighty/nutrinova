"use client";
import { Box, Skeleton } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { PatientNutrientGoalReport } from "../../_models/PatientNutrientGoalReport";
import { NutrientGoalReportItem, NutrientGoalStatusDisplay } from "../../_models/NutrientGoalReportItem";
import { CustomAccordion } from "@/components/CustomAccordion";
import { NoGoalsRowsOverlay } from "@/components/data-grid/NoGoalsRowsOverlay";
import { CreatePatientNutrientGoalModal } from "@/components/forms/CreatePatientNutrientGoalModal";
import { useGetPatientByIdQuery } from "@/app/(authorized)/patients/patientHooks";
import React from "react";
import { NutrientGoalRequestModel } from "../../_models/NutrientGoalRequestModel";
import { useCreateGoal } from "../../goalHooks";

interface PatientGoalDataGridProps {
  report: PatientNutrientGoalReport;
}

const defaultGoal: NutrientGoalRequestModel = {
  nutrientId: 0,
  patientId: "",
  dailyGoalAmount: 0,
};

export const PatientGoalsDataGrid = ({
  report,
}: PatientGoalDataGridProps) => {
  const patientQuery = useGetPatientByIdQuery(report.patientId);
  const [newGoal, setNewGoal] =
    React.useState<NutrientGoalRequestModel>(defaultGoal);
  const createGoalMutation = useCreateGoal();
  const handleSubmit = (): void => {
    if (patientQuery.data) {
      createGoalMutation.mutate(newGoal);
    }
  };

  const columns: GridColDef[] = [
    { field: "nutrientName", headerName: "Nutrient", flex: 1, minWidth: 200 },
    { field: "dailyGoalAmount", headerName: "Daily Goal", width: 200 },
    {
      field: "consumedAmount",
      headerName: "Consumed",
      width: 100,
    },
    {
      field: "remainingAmount",
      headerName: "Remaining",
      width: 100,
    },
    {
      field: "percentOfGoal",
      headerName: "% of Goal",
      width: 100,
    },
    {
      field: "goalStatus",
      headerName: "Status",
      width: 100,
      valueFormatter(params) {
        return NutrientGoalStatusDisplay[params.value as number];
      },
    }
  ];

  function capitalize(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const label = capitalize(report.patientName) + "'s Nutrient Goals";


  return (
    <CustomAccordion title={label}>
      {patientQuery.isLoading && (
        <Skeleton variant="rectangular" width="100%" height={100} />
      )}
      {patientQuery.data && (
        <CreatePatientNutrientGoalModal
          selectedPatient={patientQuery.data}
          handleSubmit={handleSubmit}
          newGoal={newGoal}
          setNewGoal={setNewGoal}
        />)
      }
      <Box
        sx={{
          mt: 2,
        }}
      >
        <DataGrid
          getRowId={(row: NutrientGoalReportItem) => row.nutrientId}
          rows={report.nutrientGoalReportItems ?? []}
          columns={columns}
          autoHeight
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          slots={{
            noRowsOverlay: () => NoGoalsRowsOverlay(),
          }}
        />
      </Box>
    </CustomAccordion>
  );
};
