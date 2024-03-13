"use client"

import { PatientNutrientReport } from "../../_models/PatientNutrientReport";
import { AllSeriesType, BarPlot, ChartsXAxis, ChartsYAxis, ResponsiveChartContainer } from "@mui/x-charts";
import { TargetAmountChart } from "./TargetAmountChart";
import React from "react";

interface NutrientGoalChartProps {
  report: PatientNutrientReport;
}

export const NutrientGoalChart: React.FC<NutrientGoalChartProps> = ({ report }
) => {
  console.log(report);

  const days = report.days.map((day) => {
    const date = new Date(day.date);
    const dayOfMonth = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    return `${dayOfMonth} ${month}`;
  });
  const recommendedTarget = report.days[0].nutrientGoalReportItems[0].recommendedTargetAmount;
  const customTarget = report.days[0].nutrientGoalReportItems[0].customTargetAmount;
  const consumed = report.days.map((day) => day.nutrientGoalReportItems[0].consumedAmount);
  const series = [
    {
      type: 'bar',
      stack: '',
      yAxisKey: 'amount',
      data: consumed,
      color: '#1976d2',
    },
  ] as AllSeriesType[];

  return (<>
    <ResponsiveChartContainer
      series={series}
      xAxis={[
        {
          id: 'days',
          data: days,
          scaleType: 'band',
        },
      ]}
      yAxis={[
        {
          id: 'amount',
          scaleType: 'linear',
        }
      ]}
    >
      <TargetAmountChart targetAmount={recommendedTarget} recommended >
        <TargetAmountChart targetAmount={customTarget} >
          <BarPlot />
          <ChartsXAxis label="Days" position="bottom" axisId="days" />
          <ChartsYAxis position="left" axisId="amount" />
        </TargetAmountChart>
      </TargetAmountChart>
    </ResponsiveChartContainer>
  </>);
};
