import { badgeKeys, UserBadge } from "@/app/types/profiles";
import Badge from "./Badge";
import { BadgeType } from "@/app/types/badge";
import { useState } from "react";
import { XMark } from "@/assets/assets";

type Props = {
  badges: UserBadge;
  expandable?: boolean;
};

export default function BadgeList({ badges, expandable = false }: Props) {
  const [expanded, setExpandded] = useState(false);
  const totalCount = badgeKeys.reduce((prev, key) => prev + badges[key], 0);

  const badgeData = badgeKeys
    .map((key) => ({
      type: key as BadgeType,
      count: badges[key] ?? 0,
    }))
    .filter((badge) => badge.count > 0);

  const handleClick = () => {
    if (expandable) {
      setExpandded(true);
    }
  };

  return (
    <div>
      <div onClick={handleClick}>
        {badgeData.map((badge, index) => {
          const offset = 10 + (expanded ? index * 60 : index * 8); // 펼치면 간격 넓게
          const zIndex = badgeData.length - index; // 위에 올수록 높은 zIndex
          const showCount = expanded || index === 0;
          const count = expanded ? badge.count : totalCount;

          return (
            <div
              key={index}
              className="absolute right-5 transition-all duration-300"
              style={{
                top: offset,
                zIndex: zIndex,
              }}
            >
              <Badge
                type={badge.type}
                count={count}
                size={50}
                showCount={showCount}
              />
            </div>
          );
        })}
      </div>
      {expanded && (
        <div
          className="absolute p-2 rounded-full bg-hanagreen-normal cursor-pointer"
          style={{ top: 10 + badgeData.length * 60, right: 32 }}
          onClick={() => setExpandded(false)}
        >
          <XMark className="w-3 h-3 stroke-white" />
        </div>
      )}
    </div>
  );
}
