import HomeIconOutline from "@/assets/icons/nav_home_icon.svg";
import HomeIconFilled from "@/assets/icons/filled_nav_home_icon.svg";

import FolderIconOutline from "@/assets/icons/nav_folder_icon.svg";
import FolderIconFilled from "@/assets/icons/fiiled_nav_folder_icon.svg";

import HeartIconOutline from "@/assets/icons/nav_heart_icon.svg";
import HeartIconFilled from "@/assets/icons/filled_nav_heart_icon.svg";

import ChatIconOutline from "@/assets/icons/nav_chat_icon.svg";
import ChatIconFilled from "@/assets/icons/filled_nav_chat_icon.svg";

import ProfileIconOutline from "@/assets/icons/nav_profile_icon.svg";
import ProfileIconFilled from "@/assets/icons/filled_nav_profile_icon.svg";
import BottomNavButton from "./BottomNavTab";

const navItems = [
  {
    label: "home",
    path: "/home",
    icon: {
      active: <HomeIconFilled className="w-10 h-10" />,
      inactive: <HomeIconOutline className="w-10 h-10" />,
    },
  },
  {
    label: "recommend",
    path: "/recommend",
    icon: {
      active: <FolderIconFilled className="w-10 h-10" />,
      inactive: <FolderIconOutline className="w-10 h-10" />,
    },
  },
  {
    label: "like",
    path: "/like",
    icon: {
      active: <HeartIconFilled className="w-10 h-10" />,
      inactive: <HeartIconOutline className="w-10 h-10" />,
    },
  },
  {
    label: "chat",
    path: "/chat",
    icon: {
      active: <ChatIconFilled className="w-10 h-10" />,
      inactive: <ChatIconOutline className="w-10 h-10" />,
    },
  },
  {
    label: "profile",
    path: "/profile",
    icon: {
      active: <ProfileIconFilled className="w-10 h-10" />,
      inactive: <ProfileIconOutline className="w-10 h-10" />,
    },
  },
];

export default function BottomNav() {
  return (
    <nav className="flex fixed left-0 right-0 bottom-0 py-2 border-t border-hanasilver bg-white justify-evenly items-center z-50 w-full">
      {navItems.map((item) => {
        return (
          <BottomNavButton
            key={item.label}
            path={item.path}
            activeIcon={item.icon.active}
            inactiveIcon={item.icon.inactive}
          />
        );
      })}
    </nav>
  );
}
