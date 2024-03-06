"use client";

import { Grid } from "@mui/material";
import { NutrientGoalReportItem } from "../../_models/NutrientGoalReportItem";
import { ProgressSummaryCard } from "./ProgressSummaryCard";
import { StarRounded } from "@mui/icons-material";

interface NutrientGoalRangeSummaryProps {
  selectedNutrient: NutrientGoalReportItem | null;
}

export const NutrientGoalRangeSummary: React.FC<NutrientGoalRangeSummaryProps> = ({
  selectedNutrient
}) => {

  console.log(selectedNutrient);

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
        </Grid>
        <Grid item xs={12} lg={8}>
        </Grid>
        <Grid item xs={12} lg={4}>
          <ProgressSummaryCard title="Best Day" summaryValue="78 g" visualContent={<StarRounded sx={{ fontSize: "4em" }} />} cardColor="warning.main" />
        </Grid>
      </Grid>
    </>
  );
};
