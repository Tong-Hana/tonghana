"use client";

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";

interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type">,
    VariantProps<typeof buttonVariants> {
  label?: string;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
}

const buttonVariants = cva(
  "inline-flex items-center justify-center transition-opacity duration-200 active:opacity-80 font-bold rounded-sm",
  {
    variants: {
      intent: {
        black: "bg-hanablack text-white",
        green: "bg-hanagreen-normal text-white",
        red: "bg-hanared-normal text-white",
        default: "bg-button-default-bg text-button-default-text",
      },
      size: {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-base",
        ml: "px-5 py-2.5 text-base",
        lg: "px-6 py-3 text-lg",
        full: "w-full h-10 text-base",
      },
    },
    defaultVariants: {
      intent: "default",
      size: "full",
    },
  },
);

export default function Button({
  label,
  className,
  intent = "default",
  size = "md",
  disabled = false,
  loading = false,
  onClick,
  type = "button",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={!loading ? onClick : undefined}
      className={cn(
        buttonVariants({ intent, size }),
        (disabled || loading) && "opacity-50 cursor-not-allowed",
        className,
      )}
      {...props}
    >
      {loading ? "처리중..." : label || children}
    </button>
  );
}
