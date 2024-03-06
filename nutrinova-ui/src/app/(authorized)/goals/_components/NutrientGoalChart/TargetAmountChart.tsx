"use client"

import { ChartsReferenceLine } from "@mui/x-charts";
import { GoalTargetAmount } from "../../_models/NutrientGoalReportItem";

interface TargetAmountChartProps {
  targetAmount: GoalTargetAmount;
  color: string;
}

export enum TargetAmountChartType {
  UpperBound = "UL",
  LowerBound = "RDA",
  Range = "AMDR",
}

export const TargetAmountChart: React.FC<TargetAmountChartProps> = ({ targetAmount, color }) => {
  const type = targetAmount.lowerLimit && targetAmount.upperLimit ? TargetAmountChartType.Range : targetAmount.lowerLimit ? TargetAmountChartType.LowerBound : TargetAmountChartType.UpperBound;

  return (
    <>
      {type === TargetAmountChartType.UpperBound &&
        <>
          <ChartsReferenceLine y={targetAmount.upperLimit} lineStyle={{ stroke: color, strokeDasharray: '5 5' }} />
        </>
      }

      {type === TargetAmountChartType.LowerBound &&
        <>
          <ChartsReferenceLine y={targetAmount.lowerLimit} lineStyle={{ stroke: color, strokeDasharray: '5 5', strokeWidth: '5' }} />
        </>
      }

      {type === TargetAmountChartType.Range &&
        <>
          <ChartsReferenceLine y={targetAmount.upperLimit} lineStyle={{ stroke: color, strokeDasharray: '5 5' }} />
          <ChartsReferenceLine y={targetAmount.lowerLimit} lineStyle={{ stroke: color, strokeDasharray: '5 5' }} />
        </>
      }
    </>
  );
};