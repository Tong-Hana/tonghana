"use client";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

type ValueFormat = "percent" | "currency";

type DoughnutChartProps = {
  values: number[];
  debtLabel: string;
  valueFormat?: ValueFormat;
};

const baseInfo = [
  { label: "입출금/예적금", color: "#43bd9f" },
  { label: "국내주식", color: "#3f98fd" },
  { label: "국내채권", color: "#3e9eca" },
  { label: "해외선진주식", color: "#6979f1" },
  { label: "해외이머징주", color: "#a17ef9" },
  { label: "해외채권", color: "#e780cd" },
  { label: "대체(원자재, ELT/ELF)", color: "#ff9562" },
  { label: "기타/현금성", color: "#f4c143" },
];

export default function DoughnutChart({
  values,
  debtLabel,
  valueFormat = "percent",
}: DoughnutChartProps) {
  const merged = baseInfo.map((item, idx) => ({
    ...item,
    value: values[idx] ?? 0,
  }));

  const rawFiltered = merged.filter((d) => d.value > 0);
  const total = rawFiltered.reduce((sum, item) => sum + item.value, 0);

  const filtered = rawFiltered.map((item) => ({
    ...item,
    value: total ? Math.round((item.value / total) * 100) : 0,
  }));

  const data = {
    labels: filtered.map((d) => d.label),
    datasets: [
      {
        data: filtered.map((d) => d.value),
        backgroundColor: filtered.map((d) => d.color),
        borderWidth: 1,
      },
    ],
  };

  const labelData = valueFormat === "percent" ? filtered : rawFiltered;

  const formatValue = (val: number) => {
    return valueFormat === "currency"
      ? `${val.toLocaleString()}만원`
      : `${val}%`;
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
    <div className="flex flex-row gap-5 justify-center items-center w-full max-w-[100%]">
      <div className="w-[8rem] min-w-[8rem] p-2 relative">
        <Doughnut data={data} options={options} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] text-center text-[#c2a244] font-semibold whitespace-nowrap leading-snug">
          <p>부채</p>
          <p>{debtLabel}</p>
        </div>
      </div>

      <div className="flex flex-col justify-center w-full max-w-[250px] gap-2">
        <p className="text-hanagold text-sm font-medium">#안정형</p>
        <ul className="text-xs text-hanablack space-y-1">
          {labelData.map((item, index) => (
            <li key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="inline-block w-[6px] h-[6px] rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span>{item.label}</span>
              </div>
              <span>{formatValue(item.value)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
