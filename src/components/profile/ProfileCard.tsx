"use client";

import { Car, HomeIcon, Job, Map } from "@/assets/assets";
import Image from "next/image";
import Tag from "@/components/common/tag/Tag";
import DoughnutChart from "@/components/chart/DoughnutChart";
import {
  DislikeButton,
  LikeButton,
} from "@/components/common/button/ReactionButton";
import { ProfileCardProps } from "@/components/profile/types/profileCardTypes";
import { useRouter } from "next/navigation";
import { InvestmentTypeLabelMap } from "@/app/types/profiles";
import { useCardLike } from "@/hooks/useCardLike";
import { useCardRemove } from "@/hooks/useCardRemove";
import toast from "react-hot-toast";

export default function ProfileCard({
  id,
  name,
  age,
  job,
  location,
  description,
  imageUrl,
  target,
  totalAsset,
  hasCar,
  hasHouse,
  carCost,
  houseCost,
  portfolioRatios,
  portfolioType,
  investorType,
  debtPercent,
  modalView = false,
}: ProfileCardProps) {
  const router = useRouter();

  const likeMutation = useCardLike(
    id,
    () => {
      toast.success(`${name}에게 좋아요를 보냈습니다!`);
    },
    (error) => {
      toast.error(error.message || "좋아요 전송에 실패했습니다.");
    },
  );

  const removeMutation = useCardRemove(id, (error) => {
    toast.error(error.message || "카드 넘기기에 실패했습니다.");
  });

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    likeMutation.mutate(id);
  };

  const handleDislike = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeMutation.mutate(id);
  };

  console.log(id, "house:", houseCost, "car:", carCost);

  return (
    <div
      key={id}
      onClick={() => !modalView && router.push(`/card/${id}`)}
      className="flex flex-col justify-center p-3 w-full rounded-xl bg-hanagreen-light border-hanagreen-light-active border gap-4 shadow-[0px_1px_3px_0px_#0000001A]"
    >
      {/* profile */}
      <div className="relative w-full aspect-square rounded-xl overflow-hidden">
        <Image
          src={imageUrl}
          alt={`${name} profile`}
          fill
          className="object-cover"
          priority
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-x-0 bottom-0 h-[20%] bg-gradient-to-b from-transparent via-black/20 to-black/60" />

        {/* Profile Info */}
        <div className="absolute bottom-0 text-white px-4 pb-2 space-y-1">
          <div className="text-lg font-semibold w-fit">
            {name}, {age}
          </div>
          <div className="text-xs flex gap-1 items-center w-fit">
            <span>
              <Job className="w-3 h-3 stroke-white fill-white" />
            </span>
            {job}
          </div>
          <div className="text-xs flex gap-1 items-center w-fit">
            <span>
              <Map className="w-3 h-3 fill-white" />
            </span>
            {location}
          </div>
          <div className="text-sm font-normal">{description}</div>
        </div>
      </div>
      {/* portfolio */}
      <div className="w-full rounded-xl bg-white flex flex-col gap-3 p-3">
        <div className="flex gap-1">
          {hasHouse && (
            <Tag
              text="자가 보유"
              size="xs"
              className="font-normal text-[0.6rem] px-[0.6rem]"
            />
          )}
          {hasCar && (
            <Tag
              text="자차 보유"
              size="xs"
              className="font-normal text-[0.6rem] px-[0.6rem]"
            />
          )}
          <Tag
            text={`#${InvestmentTypeLabelMap[investorType]} 선호`}
            size="xs"
            variant="outlined"
            className="font-medium text-[0.65rem] px-[0.6rem]"
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-sm font-normal text-text-primary">
            <span className="font-normal">🎯 목표: </span>
            {target}
          </div>

          {totalAsset && (
            <div className="text-sm font-normal text-text-primary leading-5">
              <span className="font-normal">💵 총 자산:</span> {totalAsset}
            </div>
          )}
          <div className="flex flex-row gap-1 items-center -ml-[0.15rem] text-sm font-medium text-text-primary">
            {hasHouse && houseCost && (
              <>
                <div className="flex flex-row gap-1 items-center">
                  <HomeIcon className="w-5 h-5 fill-hanagreen-normal stroke-hanagreen-normal" />
                  {houseCost}
                </div>
                <span className="text-hanasilver">|</span>
              </>
            )}
            {hasCar && carCost && (
              <div className="flex flex-row gap-1 items-center">
                <Car className="w-5 h-5 fill-hanagreen-normal stroke-hanagreen-normal" />
                {carCost}
              </div>
            )}
          </div>
        </div>
        <DoughnutChart
          values={portfolioRatios}
          portfolioType={portfolioType}
          debtLabel={debtPercent}
        />
      </div>
      {/* 좋아요, 싫어요 버튼 */}
      {!modalView && (
        <div className="flex justify-between">
          <DislikeButton
            circle
            size="md"
            modalView={modalView}
            onClick={handleDislike}
          />
          <LikeButton
            circle
            size="md"
            isActive={false}
            modalView={modalView}
            onClick={handleLike}
          />
        </div>
      )}
    </div>
  );
}
