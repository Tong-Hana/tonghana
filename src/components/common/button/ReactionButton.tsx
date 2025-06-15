"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";
import { HeartIcon, XMark } from "@/assets/assets";

const iconButtonVariants = cva(
  "inline-flex items-center justify-center transition-colors duration-200 active:opacity-80",
  {
    variants: {
      size: {
        sm: "",
        md: "",
      },
      circle: {
        true: "bg-hanagreen-light-active rounded-full",
        false: "",
      },
      intent: {
        like: "text-white hover:text-red-600 active:text-hanared-normal fill-white",
        dislike: "text-white hover:text-gray-600 active:text-gray-700",
      },
    },
    compoundVariants: [
      { size: "sm", circle: true, class: "p-1" },
      { size: "md", circle: true, class: "p-2" },
    ],
    defaultVariants: {
      size: "md",
      circle: false,
      intent: "like",
    },
  },
);

export interface IconButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type">,
    VariantProps<typeof iconButtonVariants> {
  type?: "button" | "submit" | "reset";
  iconSize?: string;
  isActive?: boolean;
}

export function IconButton({
  size = "md",
  circle = false,
  intent = "like",
  className,
  isActive,
  ...props
}: IconButtonProps) {
  const Icon = intent === "like" ? HeartIcon : XMark;
  const iconSizeClass = size === "sm" ? "w-4 h-4" : "w-5 h-5";
  const strokeWidth = size === "sm" ? "p-[0.2rem]" : "";

  return (
    <button
      type={props.type}
      className={cn(iconButtonVariants({ size, circle, intent }), className)}
      {...props}
    >
      <Icon
        className={cn(
          iconSizeClass,
          intent === "like"
            ? isActive
              ? "text-hanared-normal-active"
              : "text-white hover:text-hanared-normal-hover active:text-hanared-normal-active"
            : `text-white p-[0.1rem] ${strokeWidth} hover:text-gray-600 active:text-gray-700`,
        )}
      />
    </button>
  );
}

export function LikeButton(props: Omit<IconButtonProps, "intent">) {
  return <IconButton intent="like" {...props} />;
}

export function DislikeButton(props: Omit<IconButtonProps, "intent">) {
  return <IconButton intent="dislike" {...props} />;
}
