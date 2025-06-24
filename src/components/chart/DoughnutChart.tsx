"use client";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  PortfolioCategoryLabelMap,
  PortfolioCategoryColorMap,
  InvestmentTypeLabelMap,
  categoryKeys,
  CategoryRatios,
} from "@/app/types/profiles";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

type DoughnutChartProps = {
  values: CategoryRatios;
  debtLabel: string;
  portfolioType: string;
  showPercent?: boolean;
};

export default function DoughnutChart({
  values = {} as CategoryRatios,
  debtLabel,
  portfolioType,
}: DoughnutChartProps) {
  const portfolioData = categoryKeys
    .map((key) => {
      const value = values[key] ?? 0;
      if (!value || value === 0) {
        return null;
      }
      return {
        label: PortfolioCategoryLabelMap[key],
        color: PortfolioCategoryColorMap[key],
        value: Math.round(value * 100),
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const data = {
    labels: portfolioData.map((d) => d.label),
    datasets: [
      {
        data: portfolioData.map((d) => d.value),
        backgroundColor: portfolioData.map((d) => d.color),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    animation: false,
    cutout: "55%",
    plugins: {
      legend: { display: false },
      datalabels: {
        color: "#ffffff",
        formatter: (value: number) => `${value}`,
        anchor: "center" as const,
        align: "center" as const,
        offset: 0,
        font: {
          size: 8,
          weight: "bold" as const,
        },
      },
    },
  };

  return (
    <div className="flex flex-row gap-5 justify-center items-center w-full max-w-[100%] my-2">
      <div className="w-[8rem] min-w-[8rem] p-2 relative">
        <Doughnut data={data} options={options} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] text-center text-[#c2a244] font-semibold whitespace-nowrap leading-snug">
          <p>부채</p>
          <p>{parseFloat(debtLabel.split("%")[0]) * 100}%</p>
        </div>
      </div>

      <div className="flex flex-col justify-center w-full max-w-[250px] gap-2">
        <p className="text-hanagold text-sm font-medium">
          #{InvestmentTypeLabelMap[portfolioType]}
        </p>
        <ul className="text-xs text-hanablack space-y-1">
          {portfolioData.map((item, index) => (
            <li key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="inline-block w-[6px] h-[6px] rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span>{item.label}</span>
              </div>
              <span>{item.value}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
