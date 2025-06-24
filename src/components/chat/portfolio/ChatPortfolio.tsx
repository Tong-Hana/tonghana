import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import {
  CategoryKey,
  CategoryRatios,
  PortfolioCategoryColorMap,
  PortfolioCategoryLabelMap,
} from "@/app/types/profile";
import { Doughnut } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

type Props = {
  values: CategoryRatios;
};

export default function ChatPortfolio({ values }: Props) {
  const entries = Object.entries(values);

  const data = {
    labels: entries.map(
      ([category]) => PortfolioCategoryLabelMap[category as CategoryKey],
    ),
    datasets: [
      {
        data: entries.map(([, value]) => value),
        backgroundColor: entries.map(
          ([category]) => PortfolioCategoryColorMap[category as CategoryKey],
        ),
        borderWidth: 0,
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
          size: 12,
          weight: "bold" as const,
        },
      },
    },
  };

  return (
    <div className="w-40 min-w-40 p-2 relative">
      <Doughnut data={data} options={options} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] text-center text-[#c2a244] font-semibold whitespace-nowrap leading-snug">
        {/* <p>부채</p>
                <p>{debtLabel}</p> */}
      </div>
    </div>
  );
}
