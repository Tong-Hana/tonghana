import { badgeKeys } from "@/app/types/profiles";
import BottomSheet from "../common/BottomSheet";
import InfoCard from "../common/InfoCard";
import Badge from "./Badge";
import {
  BadgeType,
  BadgeTypeDescMap,
  BadgeTypeLabelMap,
} from "@/app/types/badge";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function BadgeBottomSheet({ open, onClose }: Props) {
  return (
    <BottomSheet open={open} onClose={onClose}>
      {/* 바텀시트 라벨 */}
      <h2 className="my-4 text-xl text-text-primary text-center font-semibold">
        뱃지
      </h2>
      {/* 바텀시트 내용 */}
      <div
        className="flex-1 overflow-y-auto px-5 py-2 bg-white mb-20 scrollbar-hide"
        style={{
          WebkitOverflowScrolling: "touch",
        }}
      >
        <InfoCard
          content="조건을 달성하고 뱃지를 모아보세요. 뱃지를 모을 때마다 추가 카드 보상이 있습니다."
          imageType="infoStarBoy"
        />

        <div className="grid grid-cols-2 gap-x-5 gap-y-5 mt-10">
          {badgeKeys.map((key) => (
            <div
              key={key}
              className="flex flex-col rounded-xl items-center shadow-card-shadow py-5 px-3 gap-2"
            >
              <Badge
                type={key as BadgeType}
                size={100}
                count={0}
                showCount={false}
              />
              <span className="text-text-primary font-semibold">
                {BadgeTypeLabelMap[key]}
              </span>
              <span className="text-text-secondary text-sm text-center">
                {BadgeTypeDescMap[key]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </BottomSheet>
  );
}
