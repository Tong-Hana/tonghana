"use client";

import clsx from "clsx";
import Image from "next/image";

interface FTTITypeCardProps {
  title: string;
  description: string;
  imageSrc: string;
  selected: boolean;
  onClick: () => void;
}

export default function FTTITypeCard({
  title,
  description,
  imageSrc,
  selected,
  onClick,
}: FTTITypeCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "w-full h-[200px] rounded-3xl p-3 flex flex-col items-center justify-center text-center border transition-all relative",
        selected
          ? "border-hanagreen-normal !bg-hanagreen-light-hover"
          : "border-transparent bg-white",
      )}
    >
      <div className="flex flex-col items-center justify-center h-full">
        <div className="flex items-center justify-center h-[80px] mb-3">
          <Image
            src={imageSrc}
            alt={title}
            width={80}
            height={80}
            className="object-contain max-h-[80px]"
          />
        </div>

        <div className="flex flex-col items-center justify-center">
          <p className="text-text-primary font-semibold text-2xl mb-1">
            {title}
          </p>
          <p className="text-text-secondary text-xs text-center line-clamp-2 whitespace-pre-line">
            {description}
          </p>
        </div>
      </div>
    </button>
  );
}
