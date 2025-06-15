"use client";

import LeftArrow from "@/assets/icons/left_arrow_icon.svg";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { PropsWithChildren } from "react";

type Props = {
  title: string;
  centerTitle?: boolean;
  showBackButton?: boolean;
};

const BackButton = () => {
  const router = useRouter();

  return (
    <button
      className="py-2 pr-2 z-10 cursor-pointer"
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
  children,
}: PropsWithChildren<Props>) {
  return (
    <header className="relative flex items-center h-12">
      {showBackButton && <BackButton />}

      <h1
        className={clsx(
          "text-2xl font-normal text-text-primary absolute left-0 right-0 px-5",
          centerTitle ? "text-center" : "text-left",
        )}
      >
        {title}
      </h1>
      <div className="absolute right-0">{children}</div>
    </header>
  );
}
