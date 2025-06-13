"use client";

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";
import { HeartIconFilled, XMark } from "@/assets/assets";

const iconButtonVariants = cva(
  "inline-flex items-center justify-center transition-colors duration-200 active:opacity-80",
  {
    variants: {
      size: {
        sm: "",
        md: "",
      },
      circle: {
        true: "bg-hanagreen-light-active rounded-full hover:bg-hanagreen-light-hover",
        false: "",
      },
      intent: {
        like: "text-white hover:text-red-600 active:text-hanared-normal fill-white",
        dislike: "text-white hover:text-gray-600 active:text-gray-700",
      },
    },
    compoundVariants: [
      { size: "sm", circle: true, class: "p-1" }, // 4px padding
      { size: "md", circle: true, class: "p-2" }, // 8px padding
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
  iconSize?: string; // Optional prop for custom icon size
}

export function IconButton({
  size = "md",
  circle = false,
  intent = "like",
  className,
  ...props
}: IconButtonProps) {
  const Icon = intent === "like" ? HeartIconFilled : XMark;
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
          intent === "like"
            ? `text-white ${iconSizeClass} hover:text-hanared-normal-hover active:text-hanared-normal-active`
            : `text-white ${iconSizeClass} p-[0.1rem] ${strokeWidth} hover:text-gray-600 active:text-gray-700`,
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
