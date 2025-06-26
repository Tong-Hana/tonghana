"use client";

import DoughnutChart from "./DoughnutChart";

export default function PortfolioCard() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">대시보드</h1>
      <DoughnutChart
        values={{
          SAVINGS: 300,
          DOMESTIC_STOCKS: 200,
          DEVELOPED_STOCKS: 165,
          EMERGING_STOCKS: 100,
          DOMESTIC_BONDS: 0,
          FOREIGN_BONDS: 0,
          ALTERNATIVE: 0,
          CASH: 100,
        }}
        debtLabel="200%"
        portfolioType="안정형"
      />
    </div>
  );
}
