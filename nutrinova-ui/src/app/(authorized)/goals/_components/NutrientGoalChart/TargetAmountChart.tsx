"use client"

import { ChartsReferenceLine, AreaPlot } from "@mui/x-charts";
import { GoalTargetAmount } from "../../_models/NutrientGoalReportItem";

interface TargetAmountChartProps {
  targetAmount: GoalTargetAmount;
  color: string;
  children?: React.ReactNode;
}

export enum TargetAmountChartType {
  UpperBound = "UL",
  LowerBound = "RDA",
  Range = "AMDR",
}

export const TargetAmountChart: React.FC<TargetAmountChartProps> = ({ targetAmount, color, children }) => {
  const type = targetAmount.lowerLimit && targetAmount.upperLimit ? TargetAmountChartType.Range : targetAmount.lowerLimit ? TargetAmountChartType.LowerBound : TargetAmountChartType.UpperBound;

  const lineStyle = {
    stroke: color,
    strokeDasharray: type === TargetAmountChartType.LowerBound ? '10 5' : '5 5',
    strokeWidth: type === TargetAmountChartType.LowerBound ? '3' : undefined,
  };

  const areaPlotStyle = {
    type: "monotone",
    dataKey: "targetAmount",
    fill: color,
    fillOpacity: 0.5,
  };

  return (
    <>
      {type === TargetAmountChartType.UpperBound &&
        <>
          <AreaPlot
            {...areaPlotStyle}
          />
          {children}
          <ChartsReferenceLine y={targetAmount.upperLimit} lineStyle={lineStyle} />
        </>
      }

      {type === TargetAmountChartType.LowerBound &&
        <>
          <AreaPlot
            {...areaPlotStyle}
          />
          {children}
          <ChartsReferenceLine y={targetAmount.lowerLimit} lineStyle={lineStyle} />
        </>
      }

      {type === TargetAmountChartType.Range &&
        <>
          <AreaPlot
            {...areaPlotStyle}
          />
          {children}
          <ChartsReferenceLine y={targetAmount.upperLimit} lineStyle={lineStyle} />
          <ChartsReferenceLine y={targetAmount.lowerLimit} lineStyle={lineStyle} />
        </>
      }
    </>
  );
};