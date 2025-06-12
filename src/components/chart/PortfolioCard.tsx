"use client";

import DoughnutChart from "./DoughnutChart";

export default function PortfolioCard() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">대시보드</h1>
      <DoughnutChart
        values={[300, 200, 165, 100, 0, 0, 0, 100]}
        debtLabel="200%"
        valueFormat="percent"
      />
    </div>
  );
}
