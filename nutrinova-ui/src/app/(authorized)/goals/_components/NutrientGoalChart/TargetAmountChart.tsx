"use client"

import { ChartsReferenceLine } from "@mui/x-charts";
import { GoalTargetAmount } from "../../_models/NutrientGoalReportItem";

interface TargetAmountChartProps {
  targetAmount: GoalTargetAmount;
  recommended?: boolean;
  children?: React.ReactNode;
}

export enum TargetAmountChartType {
  UpperBound = "UL",
  LowerBound = "RDA",
  Range = "AMDR",
}

export const TargetAmountChart: React.FC<TargetAmountChartProps> = ({ targetAmount, children, recommended = false }) => {

  const type = targetAmount.lowerLimit && targetAmount.upperLimit ? TargetAmountChartType.Range
    : targetAmount.lowerLimit ? TargetAmountChartType.LowerBound
      : TargetAmountChartType.UpperBound;

  const lineStyle = {
    stroke: recommended ? "#ffa726" : type === TargetAmountChartType.LowerBound ? '#388e3c' : type === TargetAmountChartType.UpperBound ? '#d32f2f' : '#0288d1',
    strokeDasharray: recommended ? '5 5' : '6 5',
    strokeWidth: '3',
  };

  const label = recommended ? "Recommended" : "Custom";

  return (
    <>
      {type === TargetAmountChartType.UpperBound &&
        <>
          {children}
          <ChartsReferenceLine y={targetAmount.upperLimit} lineStyle={lineStyle} label={label} />
        </>
      }

      {type === TargetAmountChartType.LowerBound &&
        <>
          {children}
          <ChartsReferenceLine y={targetAmount.lowerLimit} lineStyle={lineStyle} label={label} />
        </>
      }

      {type === TargetAmountChartType.Range &&
        <>
          {children}
          <ChartsReferenceLine y={targetAmount.upperLimit} lineStyle={lineStyle} />
          <ChartsReferenceLine y={targetAmount.lowerLimit} lineStyle={lineStyle} label={label} />
        </>
      }
    </>
  );
};