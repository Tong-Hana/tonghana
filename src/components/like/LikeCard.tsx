import { HeartIcon, Map, XMark } from "@/assets/assets";
import Image from "next/image";
import Tag from "../common/tag/Tag";
import Link from "next/link";

type Props = {
  userId: number;
  imageUrl: string;
  name: string;
  age: number;
  address: string;
  goal: string;
  investmentType: string;
};

export default function LikeCard({
  userId,
  imageUrl,
  name,
  age,
  address,
  goal,
  investmentType,
}: Props) {
  return (
    <Link href={`/card/${userId}`}>
      <div className="flex gap-3">
        <div className="flex px-5 py-4 bg-white shadow-card-shadow rounded-3xl w-full items-center">
          <div className="w-[80px] h-[80px] relative rounded-2xl overflow-hidden">
            <Image src={imageUrl} alt="profile" fill className="object-cover" />
          </div>
          <div className="flex flex-col flex-1 min-w-0 pl-3 text-xs text-text-primary">
            <div className="flex w-full justify-between items-center">
              <p className="">{name}</p>
              <button type="button">
                <XMark className="w-4 h-4 text-hanasilver" />
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
              <button type="button">
                <HeartIcon className="w-5 h-5 fill-hanasilver stroke-hanasilver" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
