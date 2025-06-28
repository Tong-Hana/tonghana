import { BadgeType, BadgeTypeImagePathMap } from "@/app/types/badge";
import { XMark } from "@/assets/assets";
import Image from "next/image";

type Props = {
  type: BadgeType;
  count: number;
  showCount: boolean;
  size: number;
};

export default function Badge({ type, count, showCount, size }: Props) {
  return (
    <div className="relative">
      <Image
        src={BadgeTypeImagePathMap[type]}
        width={size}
        height={size}
        alt=""
      />
      {count > 1 && showCount && (
        <div
          className="absolute -top-1 -right-1 p-1 rounded-full bg-hanagreen-normal "
          style={{ fontSize: 10 }}
        >
          <div className="flex items-center text-white">
            <XMark className="w-2 h-2 stroke-white" />
            {count}
          </div>
        </div>
      )}
    </div>
  );
}
