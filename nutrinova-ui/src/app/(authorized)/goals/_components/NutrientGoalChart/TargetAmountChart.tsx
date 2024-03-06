"use client"

import { ChartsReferenceLine, AreaPlot, LineChart } from "@mui/x-charts";
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

  const lineStyle = {
    stroke: color,
    strokeDasharray: type === TargetAmountChartType.LowerBound ? '10 5' : '5 5',
    strokeWidth: type === TargetAmountChartType.LowerBound ? '3' : undefined,
  };

const data = [4000, 3000, 2000, null, 1890, 2390, 3490];
const xData = ['Page A', 'Page B', 'Page C', 'Page D', 'Page E', 'Page F', 'Page G'];

  return (
    <>
      {type === TargetAmountChartType.UpperBound &&
        <>
          <ChartsReferenceLine y={targetAmount.upperLimit} lineStyle={lineStyle} />
        </>
      }

      {type === TargetAmountChartType.LowerBound &&
        <>
          <ChartsReferenceLine y={targetAmount.lowerLimit} lineStyle={lineStyle} />
        <LineChart
          xAxis={[{ data: xData, scaleType: 'point' }]}
          series={[{ data, showMark: false, area: true, connectNulls: true }]}
          height={200}
          margin={{ top: 10, bottom: 20 }}
        />
        </>
      }

      {type === TargetAmountChartType.Range &&
        <>
          <ChartsReferenceLine y={targetAmount.upperLimit} lineStyle={lineStyle} />
          <ChartsReferenceLine y={targetAmount.lowerLimit} lineStyle={lineStyle} />
          <AreaPlot type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
        </>
      }
    </>
  );
};