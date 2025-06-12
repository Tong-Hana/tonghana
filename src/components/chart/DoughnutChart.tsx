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

  //0값 제거
  const rawFiltered = merged.filter((d) => d.value > 0);

  // 비율 계산
  const total = rawFiltered.reduce((sum, item) => sum + item.value, 0);
  const filtered = rawFiltered.map((item) => ({
    ...item,
    value: total ? Math.round((item.value / total) * 100) : 0,
  }));

  //그래프 데이터 값
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

  //라벨 데이터 값
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
    <div className="flex flex-row gap-7 w-fit h-[146px] justify-center items-center relative">
      <div className="w-[8rem] p-2 relative">
        <Doughnut data={data} options={options} />
        {/* 중앙 부채 텍스트 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[9px] text-center text-[#c2a244] font-semibold whitespace-nowrap">
          <p>부채</p>
          <p>{debtLabel}</p>
        </div>
      </div>

      <div className="w-fit gap-1">
        <p className="text-hanagold text-sm font-medium">#안정형</p>
        <ul className="text-[8px] text-hanablack">
          {labelData.map((item, index) => (
            <li key={index} className="flex items-center space-x-2">
              <span
                className="inline-block w-[5px] h-[5px] rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span>{item.label}</span>
              <span className="ml-auto">{formatValue(item.value)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
