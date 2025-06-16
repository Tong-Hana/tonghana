"use client";

import { useState } from "react";
import Input from "@/components/common/input/Input";
import Tag from "@/components/common/tag/Tag";

interface AssetToggleRowProps {
  unit: string;
}

export default function AssetToggleRow({ unit }: AssetToggleRowProps) {
  const [isOwned, setIsOwned] = useState<boolean>(false);
  const [marketPrice, setMarketPrice] = useState<string>("");

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 whitespace-nowrap">
        <Tag
          text="보유"
          selectable
          selected={isOwned}
          onClick={() => setIsOwned(true)}
        />
        <Tag
          text="미보유"
          selectable
          selected={!isOwned}
          onClick={() => setIsOwned(false)}
        />
      </div>

      {isOwned && (
        <div className="flex-1">
          <Input
            placeholder="시세 입력"
            unit={unit}
            unitPosition="end"
            value={marketPrice}
            onChange={(e) => setMarketPrice(e.target.value)}
            className="w-full"
          />
        </div>
      )}
    </div>
  );
}
