import Image from "next/image";
import RightArrow from "@/assets/icons/right_arrow_icon.svg";
import { HanaProductListItemProps } from "./types/HanaProducts";

export default function HanaProductListItem({
  order,
  name,
  interestRate,
  maxInterestRate,
  logoUrl = "/hana_logo.svg",
  onClick,
}: HanaProductListItemProps) {
  return (
    <div
      className="flex items-center text-text-primary justify-between px-4 py-3 bg-white rounded-2xl shadow-sm cursor-pointer h-[4.5rem]"
      onClick={onClick}
    >
      {/* 왼쪽: 순위, 로고 */}
      <div className="flex gap-5 items-center">
        <div className="text-lg font-semibold w-4 text-right">{order}</div>
        <div className="relative w-6 h-5">
          <Image src={logoUrl} alt="logo" fill className="object-contain" />
        </div>
      </div>

      {/* 오른쪽: 이름, 금리, 아이콘 */}
      <div className="flex flex-col items-start justify-center">
        <span className=" font-normal text-base">{name}</span>
        {interestRate != 0 && (
          <p className="text-base text-hanagreen-normal font-normal">
            {interestRate.toFixed(2)}% ~ {maxInterestRate.toFixed(2)}%
            <span className="text-gray-500 text-sm font-light">
              {" "}
              연(세전, 1년)
            </span>
          </p>
        )}
      </div>
      <RightArrow size={18} className="text-gray-400" />
    </div>
  );
}
