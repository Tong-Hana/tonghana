type Segment = {
  label: "저축" | "투자" | "여가/취미" | "생활" | "기타";
  value: number; // %
};

type StackedBarProps = {
  segments: Segment[];
};

const COLOR_MAP: Record<Segment["label"], string> = {
  저축: "#4c5caa",
  투자: "#7DB9F5",
  "여가/취미": "#9b8df1",
  생활: "#f29090",
  기타: "#C4C4DE",
};

export default function StackedBar({ segments }: StackedBarProps) {
  return (
    <div className="w-full space-y-3">
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
      <div className="flex flex-wrap justify-around text-hanablack text-[0.7rem]">
        {segments.map((seg, idx) => (
          <div key={idx} className="flex items-center gap-1 mb-2">
            <span
              className="w-[6px] h-[6px] rounded-full"
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
