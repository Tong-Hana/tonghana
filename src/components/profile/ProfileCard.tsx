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
import { useState } from "react";
import { useRouter } from "next/navigation";
import { InvestmentTypeLabelMap } from "@/app/types/profiles";

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
  carCost,
  houseCost,
  portfolioRatios,
  portfolioType,
  investorType,
  debtPercent,
  showDetail = false,
  modalView = false,
}: ProfileCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const router = useRouter();

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
              <Job />
            </span>
            {job}
          </div>
          <div className="text-xs flex gap-1 items-center w-fit">
            <span>
              <Map />
            </span>
            {location}
          </div>
          <div className="text-sm font-normal">{description}</div>
        </div>
      </div>
      {/* portfolio */}
      <div className="w-full rounded-xl bg-white flex flex-col gap-3 p-3">
        <div className="flex gap-1">
          {!showDetail && (
            <Tag
              text="자가 보유"
              size="xs"
              className="font-normal text-[0.6rem] px-[0.6rem]"
            />
          )}
          {!showDetail && (
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
          {showDetail && (
            <>
              <div className="text-sm font-normal text-text-primary leading-5">
                <span className="font-normal">💵 총 자산:</span> {totalAsset}
              </div>
              <div className="flex flex-row gap-1 items-center -ml-[0.15rem] text-sm font-medium text-text-primary">
                <div className="flex flex-row gap-1 items-center">
                  <HomeIcon className="w-5 h-5 text-hanagreen-normal" />
                  {houseCost}
                </div>
                <span className="text-hanasilver">|</span>
                <div className="flex flex-row gap-1 items-center">
                  <Car className="w-5 h-5" />
                  {carCost}
                </div>
              </div>
            </>
          )}
        </div>
        <DoughnutChart
          values={portfolioRatios}
          portfolioType={portfolioType}
          debtLabel={debtPercent}
          showPercent={!showDetail}
        />
      </div>
      {/* 좋아요, 싫어요 버튼 */}
      <div className="flex justify-between">
        <DislikeButton circle size="md" modalView={modalView} />
        <LikeButton
          circle
          size="md"
          isActive={isLiked}
          modalView={modalView}
          onClick={() => setIsLiked((prev) => !prev)}
        />
      </div>
    </div>
  );
}
