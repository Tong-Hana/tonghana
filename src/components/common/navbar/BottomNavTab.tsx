"use client";

import { usePathname, useRouter } from "next/navigation";

import React from "react";

type Props = {
  path: string;
  activeIcon: React.ReactNode;
  inactiveIcon: React.ReactNode;
};

export default function BottomNavButton({
  path,
  activeIcon,
  inactiveIcon,
}: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = pathname === path || pathname.startsWith(path + "/");

  return (
    <button onClick={() => router.push(path)} className="text-xs rounded-xl">
      {isActive ? activeIcon : inactiveIcon}
    </button>
  );
}
