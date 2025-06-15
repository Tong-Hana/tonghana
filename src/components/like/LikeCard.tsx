import { HeartIcon, MapPin, X } from "@/assets/assets";
import Image from "next/image";
import Tag from "../common/tag/Tag";
import Link from "next/link";

type Props = {
  imageUrl: string;
  name: string;
  age: number;
  address: string;
  goal: string;
  ftti: string;
};

export default function LikeCard({
  imageUrl,
  name,
  age,
  address,
  goal,
  ftti,
}: Props) {
  return (
    <Link href={"/"}>
      <div className="flex gap-3">
        <div className="flex px-5 py-4 bg-white shadow-card-shadow rounded-3xl w-full items-center">
          <div className="w-[80px] h-[80px] relative rounded-2xl overflow-hidden">
            <Image src={imageUrl} alt="profile" fill className="object-cover" />
          </div>
          <div className="flex flex-col flex-1 min-w-0 pl-3 text-xs text-text-primary gap-1">
            <div className="flex w-full justify-between items-center">
              <p className="">{name}</p>
              <button type="button">
                <X className="w-5 h-5 fill-hanasilver" />
              </button>
            </div>
            <div className="flex font-light items-center">
              <p className="mr-2">{age}세</p>
              <MapPin className="mr-[2px] w-4 h-4 fill-hanasilver" />
              <p>{address}</p>
            </div>
            <p className="truncate w-full block">{goal}</p>
            <div className="flex w-full justify-between items-center">
              <Tag className=" text-[10px]" text={ftti} size={"xs"} />
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
