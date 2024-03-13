"use client";

import { GoalTargetAmount, NutrientGoalStatus } from "@/app/(authorized)/goals/_models/NutrientGoalReportItem";

export type StatusType = 'In Progress' | 'Over' | 'Achieved';

export interface NutrientProgressProps {
  nutrientName: string;
  consumedAmount: number;
  targetAmount: GoalTargetAmount;
  status: NutrientGoalStatus;
  unit: string;
}