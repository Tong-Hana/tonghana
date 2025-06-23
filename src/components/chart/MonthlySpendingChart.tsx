import { ConsumeHistory } from "@/services/userProfile";

export default function MonthlySpendingChart({
  data,
}: {
  data: ConsumeHistory;
}) {
  const monthlySpendingRaw = [
    { label: "저축", value: data.savingsRate, color: "#4c5caa" },
    { label: "투자", value: data.investmentRate, color: "#7DB9F5" },
    { label: "여가/취미", value: data.leisureRate, color: "#9b8df1" },
    { label: "생활", value: data.livingExpenseRate, color: "#f29090" },
    { label: "기타", value: data.otherRate, color: "#C4C4DE" },
  ];

  const total = monthlySpendingRaw.reduce((sum, seg) => sum + seg.value, 0);

  const monthlySpending = monthlySpendingRaw.map((seg) => ({
    ...seg,
    width: total > 0 ? (seg.value / total) * 100 : 0,
    percent: Math.round(seg.value * 100),
  }));

  return (
    <div className="rounded-xl p-5 bg-white w-full space-y-5 shadow-[0px_1px_3px_0px_#0000001A]">
      <h2 className="text-hanagreen-normal font-semibold text-lg">
        지난 달 소비
      </h2>
      {/* 그래프 막대 */}
      <div className="w-full px-1 h-4 overflow-hidden flex">
        {monthlySpending.map((seg, idx) => (
          <div
            key={idx}
            style={{
              width: `${seg.width}%`,
              backgroundColor: seg.color,
              borderRight:
                idx !== monthlySpending.length - 1
                  ? "0.5px solid white"
                  : "none",
            }}
          />
        ))}
      </div>

      {/* 하단 라벨 */}
      <div className="flex flex-wrap justify-around text-hanablack text-[0.8rem]">
        {monthlySpending.map((seg, idx) => (
          <div key={idx} className="flex items-center text-center gap-1 mb-2">
            <span
              className="w-[0.4rem] h-[0.4rem] rounded-full"
              style={{ backgroundColor: seg.color }}
            />
            <span className="flex-1">{seg.label}</span>
            <span>{seg.percent}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
