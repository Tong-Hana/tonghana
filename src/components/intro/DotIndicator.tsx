type Props = {
  total: number;
  current: number;
  onDotClick?: (index: number) => void;
};

export default function DotIndicator({ total, current, onDotClick }: Props) {
  return (
    <div className="flex justify-center gap-2 mt-4">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onDotClick?.(i)}
          className={`w-2 h-2 rounded-full transition ${
            current === i ? "bg-hanagreen-normal" : "bg-hanasilver"
          }`}
        />
      ))}
    </div>
  );
}
