"use client";

import { useRouter } from "next/navigation";
import clsx from "clsx";
import { PropsWithChildren, useEffect, useState } from "react";
import { LeftArrow } from "@/assets/assets";

type Props = {
  title: string;
  centerTitle?: boolean;
  showBackButton?: boolean;
  scrollHide?: boolean;
  color?: "white" | "black";
  className?: string;
};

const BackButton = ({ color }: { color: "white" | "black" }) => {
  const router = useRouter();

  return (
    <button
      className="py-2 px-2 z-10 cursor-pointer"
      type="button"
      onClick={() => router.back()}
    >
      <LeftArrow
        className={clsx(
          "w-8 h-8 stroke-black stroke-[0.1rem]",
          color === "black" ? "stroke-black" : "stroke-white",
        )}
      />
    </button>
  );
};

export default function Header({
  title,
  centerTitle = true,
  showBackButton = true,
  scrollHide = true,
  color = "black",
  className,
  children,
}: PropsWithChildren<Props>) {
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    if (!scrollHide) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 0) {
        // 아래로 스크롤: 헤더 숨김
        setShow(false);
      } else {
        // 위로 스크롤: 헤더 보여줌
        setShow(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollHide, lastScrollY]);

  return (
    <header>
      <div className="h-12"></div>
      <div
        className={clsx(
          "fixed z-10 left-0 top-0 w-full bg-background transition-transform duration-300",
          scrollHide ? (show ? "translate-y-0" : "-translate-y-full") : "",
          className,
        )}
      >
        <div className="relative flex items-center frame-container h-12">
          {showBackButton && <BackButton color={color} />}

          <h1
            className={clsx(
              "text-2xl font-normal  absolute left-0 right-0",
              centerTitle ? "text-center" : "pl-5 text-left",
              color === "black" ? "text-text-primary" : "text-white",
            )}
          >
            {title}
          </h1>
          <div className="absolute right-0">{children}</div>
        </div>
      </div>
    </header>
  );
}
