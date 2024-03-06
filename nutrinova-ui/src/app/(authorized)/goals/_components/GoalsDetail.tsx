"use client";

import React, { useState } from "react";
import { NutrientGoalReportItem } from "@/app/(authorized)/goals/_models/NutrientGoalReportItem";
import { DailyNutrientCarouselSelector } from "./DailyNutrientCarouselSelector";
import { NutrientGoalRangeSummary } from "./NutrientGoalChart/NutrientGoalChart";

const GoalsDetail = () => {
  const [selectedNutrient, setSelectedNutrient] = useState<NutrientGoalReportItem | null>(null);

  const handleSelectedNutrient = (nutrient: NutrientGoalReportItem) => {
    setSelectedNutrient(nutrient);
  };

  console.log(selectedNutrient);

  return (
    <>
      <DailyNutrientCarouselSelector onNutrientSelected={handleSelectedNutrient} />
      <NutrientGoalRangeSummary selectedNutrient={selectedNutrient} />
    </>
  );
};

export default GoalsDetail;