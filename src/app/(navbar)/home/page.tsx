import DoughnutChart from "@/components/chart/DoughnutChart";
import HorizontalBarChart from "@/components/chart/HorizontalBarChart";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <DoughnutChart
        values={[300, 200, 165, 100, 0, 0, 0, 100]}
        debtLabel="200%"
        valueFormat="percent"
      />
      <div className="w-[353px]">
        <HorizontalBarChart
          segments={[
            { label: "저축", value: 20 },
            { label: "투자", value: 10 },
            { label: "여가/취미", value: 20 },
            { label: "생활", value: 25 },
            { label: "기타", value: 25 },
          ]}
        />
      </div>
    </div>
  );
}
