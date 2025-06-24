"use client";

import Input from "@/components/common/input/Input";
import Tag from "@/components/common/tag/Tag";

interface AssetToggleRowProps {
  unit: string;
  value: string;
  onToggle: (checked: boolean) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isOwned: boolean;
}

export default function AssetToggleRow({
  unit,
  value,
  onToggle,
  onChange,
  isOwned,
}: AssetToggleRowProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 whitespace-nowrap">
        <Tag
          text="보유"
          selectable
          selected={isOwned}
          onClick={() => onToggle(true)}
        />
        <Tag
          text="미보유"
          selectable
          selected={!isOwned}
          onClick={() => onToggle(false)}
        />
      </div>

      {isOwned && (
        <div className="flex-1">
          <Input
            placeholder="시세 입력"
            unit={unit}
            unitPosition="end"
            value={value}
            onChange={onChange}
            className="w-full"
          />
        </div>
      )}
    </div>
  );
}
