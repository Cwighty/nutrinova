"use client";

import React, { useState } from "react";
import { NutrientGoalReportItem } from "@/app/(authorized)/goals/_models/NutrientGoalReportItem";
import { DailyNutrientCarouselSelector } from "./DailyNutrientCarouselSelector";
import { NutrientGoalRangeSummary } from "./NutrientGoalChart/NutrientGoalRangeSummary";
import { Box, Skeleton } from "@mui/material";

const GoalsDetail = () => {
  const [selectedNutrient, setSelectedNutrient] = useState<NutrientGoalReportItem | null>(null);

  const handleSelectedNutrient = (nutrient: NutrientGoalReportItem) => {
    setSelectedNutrient(nutrient);
  };

  console.log(selectedNutrient);

  return (
    <>
      <DailyNutrientCarouselSelector onNutrientSelected={handleSelectedNutrient} />
      <Box sx={{ mt: 3 }}>
        {!selectedNutrient && <Box>
          <Skeleton variant="rectangular" sx={{ height: 400 }} />
        </Box>}
        {selectedNutrient && <NutrientGoalRangeSummary selectedNutrient={selectedNutrient} />}
      </Box>
    </>
  );
};

export default GoalsDetail;