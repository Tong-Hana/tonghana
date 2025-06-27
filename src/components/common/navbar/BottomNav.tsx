"use client";

import {
  ChatIcon,
  QuizIcon,
  FilledQuizIcon,
  HeartIcon,
  HomeIcon,
  ProfileIcon,
  FilledProfileIcon,
} from "@/assets/assets";
import BottomNavButton from "./BottomNavTab";
import clsx from "clsx";

const NavIconSize = "w-8 h-8";

const navItems = [
  {
    label: "home",
    path: "/home",
    icon: {
      active: (
        <HomeIcon
          className={clsx(
            "fill-hanagreen-normal stroke-hanagreen-normal",
            NavIconSize,
          )}
        />
      ),
      inactive: (
        <HomeIcon
          className={clsx("fill-white stroke-hanasilver stroke-2", NavIconSize)}
        />
      ),
    },
  },
  {
    label: "quiz",
    path: "/quiz",
    icon: {
      active: (
        <FilledQuizIcon
          className={clsx(
            "fill-hanagreen-normal stroke-hanagreen-normal",
            NavIconSize,
          )}
        />
      ),
      inactive: <QuizIcon className={clsx("fill-hanasilver", NavIconSize)} />,
    },
  },
  {
    label: "like",
    path: "/like",
    icon: {
      active: (
        <HeartIcon
          className={clsx(
            "fill-hanagreen-normal stroke-hanagreen-normal",
            NavIconSize,
          )}
        />
      ),
      inactive: (
        <HeartIcon
          className={clsx("stroke-hanasilver stroke-2 fill-white", NavIconSize)}
        />
      ),
    },
  },
  {
    label: "chat",
    path: "/chat",
    icon: {
      active: (
        <ChatIcon
          className={clsx(
            "fill-hanagreen-normal stroke-hanagreen-normal",
            NavIconSize,
          )}
        />
      ),
      inactive: (
        <ChatIcon
          className={clsx("fill-white stroke-hanasilver stroke-2", NavIconSize)}
        />
      ),
    },
  },
  {
    label: "profile",
    path: "/profile",
    icon: {
      active: <FilledProfileIcon className={clsx(NavIconSize)} />,
      inactive: (
        <ProfileIcon
          className={clsx("fill-white stroke-hanasilver stroke-2", NavIconSize)}
        />
      ),
    },
  },
];

export default function BottomNav() {
  return (
    <nav>
      <div className="h-12"></div>
      <div className="fixed frame-container bottom-0 w-full z-50  bg-white">
        <div className=" flex items-center justify-evenly py-2">
          {navItems.map((item) => (
            <BottomNavButton
              key={item.label}
              path={item.path}
              activeIcon={item.icon.active}
              inactiveIcon={item.icon.inactive}
            />
          ))}
        </div>
      </div>
    </nav>
  );
}
