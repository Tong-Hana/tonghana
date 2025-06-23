"use client";

import { cn } from "@/utils/cn";
import { tagVariants } from "@/components/common/tag/type/styles";
import type { TagProps } from "@/components/common/tag/type/types";

export default function InteractiveTag({
  text,
  selected,
  size = "md",
  disabled,
  className,
  onClick,
  ...rest
}: Omit<TagProps, "selectable">) {
  const variant = selected ? "selected" : "interactive";

  return (
    <div
      role="button"
      onClick={!disabled ? onClick : undefined}
      className={cn(
        tagVariants({ variant, size, disabled }),
        "cursor-pointer",
        className,
      )}
      {...rest}
    >
      {text}
    </div>
  );
}
