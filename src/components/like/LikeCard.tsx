"use client";

import { HeartIcon, Map, XMark } from "@/assets/assets";
import Image from "next/image";
import Tag from "../common/tag/Tag";
import Link from "next/link";
import { useLikeAccept, useLikeReject } from "@/hooks/useLike";
import toast from "react-hot-toast";

type Props = {
  userId: number;
  matchId: number;
  imageUrl: string;
  name: string;
  age: number;
  address: string;
  goal: string;
  investmentType: string;
};

export default function LikeCard({
  userId,
  matchId,
  imageUrl,
  name,
  age,
  address,
  goal,
  investmentType,
}: Props) {
  const acceptMutation = useLikeAccept(
    matchId,
    async () => {
      toast.success(`${name}과 통했어요! 채팅방을 확인하세요`);
    },
    (error) => {
      toast.error(error.message);
    },
  );

  const handleAcceptLike = () => {
    acceptMutation.mutate(matchId);
  };

  const rejectMutation = useLikeReject(
    matchId,
    async () => {
      toast.success(`${name}의 좋아요가 거절되었습니다.`);
    },
    (error) => {
      toast.error(error.message);
    },
  );

  const handleRejectLike = () => {
    rejectMutation.mutate(matchId);
  };

  return (
    <div className="flex gap-3">
      <div className="flex px-5 py-4 bg-white shadow-card-shadow rounded-3xl w-full items-center">
        <Link href={`/card/${userId}`}>
          <div className="w-[80px] h-[80px] relative rounded-2xl overflow-hidden">
            <Image src={imageUrl} alt="profile" fill className="object-cover" />
          </div>
        </Link>
        <div className="flex flex-col flex-1 min-w-0 pl-3 text-xs text-text-primary">
          <div className="flex w-full justify-between items-center">
            <p className="">{name}</p>
            <button type="button" onClick={handleRejectLike}>
              <XMark className="mr-0.5 w-4 h-4 fill-hanasilver hover:fill-hanablack" />
            </button>
          </div>
          <div className="flex text-[10px] font-light items-center">
            <p className="mr-2">{age}세</p>
            <Map className="mr-[2px] w-3 h-3 fill-hanasilver" />
            <p>{address}</p>
          </div>
          <p className="mt-1 truncate w-full block text-[10px]">{goal}</p>
          <div className="flex mt-1 w-full justify-between items-center">
            <Tag
              className=" text-[8px] py-0.5 px-2"
              text={investmentType}
              size={"xs"}
            />
            <button type="button" onClick={handleAcceptLike}>
              <HeartIcon className="w-5 h-5 fill-hanasilver stroke-hanasilver hover:fill-hanared-normal hover:stroke-hanared-normal" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
