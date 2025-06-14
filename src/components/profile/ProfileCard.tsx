import { Car, HomeIcon, Job, Map } from "@/assets/assets";
import Image from "next/image";
import DoughnutChart from "../chart/DoughnutChart";
import { DislikeButton, LikeButton } from "../common/button/ReactionButton";
import Tag from "../common/tag/Tag";
import PairingBook from "./ParingBook";
import HorizontalBarChart from "../chart/HorizontalBarChart";

interface ProfileCardProps {
  name: string;
  age: number;
  job: string;
  location: string;
  description: string;
  imageUrl: string;
  target: string;
  totalAsset: string;
  carCost: string;
  houseCost: string;
}

export default function ProfileCard({
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
}: ProfileCardProps) {
  const answer = [
    { id: 1, answer: "5000만원, 30만원, 20만원" },
    { id: 2, answer: "서울시 압구정동" },
    { id: 3, answer: "1000만원대 이상" },
  ];

  return (
    <div className="flex flex-col justify-center p-3 w-full rounded-xl bg-hanagreen-light border-hanagreen-light-active border gap-4">
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
          <Tag
            text="자가 보유"
            size="xs"
            className="font-normal text-[0.6rem] px-[0.6rem]"
          />
          <Tag
            text="자차 보유"
            size="xs"
            className="font-normal text-[0.6rem] px-[0.6rem]"
          />
          <Tag
            text="#적극투자 선호"
            size="xs"
            variant="outlined"
            className="font-normal text-[0.6rem] px-[0.6rem]"
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-sm font-normal text-text-primary">
            <span className="font-normal">🎯 목표: </span>
            {target}
          </div>
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
        </div>
        <DoughnutChart
          values={[300, 200, 165, 100, 0, 0, 0, 100]}
          debtLabel="200%"
          valueFormat="percent"
        />
      </div>
      {/* paringbook */}
      <PairingBook answers={answer} />
      {/* 지난 달 소비 */}
      <div className="rounded-xl p-5 bg-white w-full space-y-5">
        <h2 className="text-hanagreen-normal font-semibold text-lg">
          지난 달 소비
        </h2>
        <HorizontalBarChart
          segments={[
            { label: "저축", value: 20 },
            { label: "투자", value: 10 },
            { label: "여가/취미", value: 20 },
            { label: "생활", value: 25 },
            { label: "기타", value: 25 },
          ]}
        />
      </div>

      <div className="flex justify-between">
        <DislikeButton circle size="md" />
        <LikeButton circle size="md" onClick={() => console.log("좋아요!")} />
      </div>
    </div>
  );
}
