"use client";

import LeftArrow from "@/assets/icons/left_arrow_icon.svg";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { PropsWithChildren } from "react";

type Props = {
  title: string;
  centerTitle?: boolean;
  showBackButton?: boolean;
  bgColor?: string;
};

const BackButton = () => {
  const router = useRouter();

  return (
    <button
      className="py-2 px-2 z-10 cursor-pointer"
      type="button"
      onClick={() => router.back()}
    >
      <LeftArrow className="w-8 h-8 stroke-black" />
    </button>
  );
};

export default function Header({
  title,
  centerTitle = true,
  showBackButton = true,
  bgColor,
  children,
}: PropsWithChildren<Props>) {
  return (
    <header
      className={clsx(
        "fixed z-50 left-0 top-0 w-full",
        bgColor ?? "bg-background",
      )}
    >
      <div className="relative flex items-center h-12">
        {showBackButton && <BackButton />}

        <h1
          className={clsx(
            "text-2xl font-normal  absolute left-0 right-0",
            centerTitle ? "text-center" : "pl-5 text-left",
          )}
        >
          {title}
        </h1>
        <div className="absolute right-0">{children}</div>
      </div>
    </header>
  );
}
