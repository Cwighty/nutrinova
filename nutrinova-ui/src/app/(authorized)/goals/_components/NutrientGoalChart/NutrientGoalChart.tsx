"use client"

import { PatientNutrientReport } from "../../_models/PatientNutrientReport";
import { AllSeriesType, BarPlot, ChartContainer, ChartsReferenceLine, ChartsXAxis, ChartsYAxis, LinePlot } from "@mui/x-charts";
import { TargetAmountChart } from "./TargetAmountChart";

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
  const consumed = report.days.map((day) => day.nutrientGoalReportItems[0].consumedAmount);
  const series = [
    {
      type: 'bar',
      stack: '',
      yAxisKey: 'amount',
      data: [10,12],
    },
  ] as AllSeriesType[];

  return (<>
    <ChartContainer
      series={series}
      width={700}
      height={400}
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
        },
        {
          id: 'pib',
          scaleType: 'log',
        },
      ]}
    >
      <BarPlot />
      <LinePlot />
      <TargetAmountChart targetAmount={report.days[0].nutrientGoalReportItems[0].recommendedTargetAmount} color="yellow" />
      <TargetAmountChart targetAmount={report.days[0].nutrientGoalReportItems[0].customTargetAmount} color="green" />
      <ChartsXAxis label="Days" position="bottom" axisId="days" />
      <ChartsYAxis label="Results" position="left" axisId="amount" />
    </ChartContainer>
  </>);
};