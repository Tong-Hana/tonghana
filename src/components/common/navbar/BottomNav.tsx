"use client";

import {
  ChatIcon,
  FolderIcon,
  HeartIcon,
  HomeIcon,
  ProfileIcon,
} from "@/assets/assets";
import BottomNavButton from "./BottomNavTab";

const navItems = [
  {
    label: "home",
    path: "/home",
    icon: {
      active: (
        <HomeIcon className="w-10 h-10 text-hanagreen-normal stroke-hanagreen-normal" />
      ),
      inactive: <HomeIcon className="w-10 h-10 stroke-hanasilver text-white" />,
    },
  },
  {
    label: "recommend",
    path: "/recommend",
    icon: {
      active: (
        <FolderIcon className="w-10 h-10 fill-hanagreen-normal stroke-white" />
      ),
      inactive: (
        <FolderIcon className="w-10 h-10 stroke-hanasilver fill-white" />
      ),
    },
  },
  {
    label: "like",
    path: "/like",
    icon: {
      active: (
        <HeartIcon className="w-10 h-10 fill-hanagreen-normal stroke-hanagreen-normal" />
      ),
      inactive: (
        <HeartIcon className="w-10 h-10 stroke-hanasilver fill-white" />
      ),
    },
  },
  {
    label: "chat",
    path: "/chat",
    icon: {
      active: (
        <ChatIcon className="w-10 h-10 text-hanagreen-normal stroke-hanagreen-normal" />
      ),
      inactive: <ChatIcon className="w-10 h-10 stroke-hanasilver fill-white" />,
    },
  },
  {
    label: "profile",
    path: "/profile",
    icon: {
      active: <ProfileIcon className="w-10 h-10 stroke-hanagreen-normal" />,
      inactive: (
        <ProfileIcon className="w-10 h-10 fill-white stroke-hanasilver" />
      ),
    },
  },
];

export default function BottomNav() {
  return (
    <nav>
      <div className="h-14"></div>
      <div className="fixed bottom-0 left-0 w-full z-50 border-t border-hanasilver bg-white">
        <div className="frame-container flex items-center justify-evenly py-2">
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
