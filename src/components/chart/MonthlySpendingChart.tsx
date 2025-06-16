type Segment = {
  label: string;
  value: number; // %
};

type Props = {
  segments: Segment[];
};

const COLOR_MAP: Record<Segment["label"], string> = {
  저축: "#4c5caa",
  투자: "#7DB9F5",
  "여가/취미": "#9b8df1",
  생활: "#f29090",
  기타: "#C4C4DE",
};

export default function MonthlySpendingChart({ segments }: Props) {
  return (
    <div className="rounded-xl p-5 bg-white w-full space-y-5 shadow-[0px_1px_3px_0px_#0000001A]">
      <h2 className="text-hanagreen-normal font-semibold text-lg">
        지난 달 소비
      </h2>
      {/* 그래프 막대 */}
      <div className="w-full h-4 rounded-sm overflow-hidden flex">
        {segments.map((seg, idx) => (
          <div
            key={idx}
            style={{
              width: `${seg.value}%`,
              backgroundColor: COLOR_MAP[seg.label],
              borderRight:
                idx !== segments.length - 1 ? "0.5px solid white" : "none",
            }}
          />
        ))}
      </div>

      {/* 하단 라벨 */}
      <div className="flex flex-wrap justify-around text-hanablack text-[0.8rem]">
        {segments.map((seg, idx) => (
          <div key={idx} className="flex items-center text-center gap-1 mb-2">
            <span
              className="w-[0.4rem] h-[0.4rem] rounded-full"
              style={{ backgroundColor: COLOR_MAP[seg.label] }}
            />
            <span className="flex-1">{seg.label}</span>
            <span>{seg.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
