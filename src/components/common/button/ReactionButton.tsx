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
        lg: "",
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
  iconClassName?: string;
  modalView?: boolean;
}

export function IconButton({
  size = "md",
  circle = false,
  intent = "like",
  className,
  onClick,
  isActive,
  iconClassName,
  modalView,
  ...props
}: IconButtonProps) {
  const Icon = intent === "like" ? HeartIcon : XMark;
  const iconSizeClass =
    size === "sm" ? "w-4 h-4" : size === "md" ? "w-5 h-5" : "w-6 h-6";
  const strokeWidth = size === "sm" ? "p-[0.2rem]" : "";

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (modalView) return;
    e.stopPropagation();

    onClick?.(e);
  };

  return (
    <button
      type={props.type}
      className={cn(iconButtonVariants({ size, circle, intent }), className)}
      onClick={handleClick}
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
          iconClassName,
        )}
      />
    </button>
  );
}

export function LikeButton({
  isActive = false,
  modalView = false,
  onClick,
  ...props
}: IconButtonProps) {
  return (
    <IconButton
      intent="like"
      isActive={isActive}
      modalView={modalView}
      onClick={onClick}
      {...props}
    />
  );
}

export function DislikeButton({
  modalView = false,
  onClick,
  ...props
}: IconButtonProps) {
  return (
    <IconButton
      intent="dislike"
      modalView={modalView}
      onClick={onClick}
      {...props}
    />
  );
}
