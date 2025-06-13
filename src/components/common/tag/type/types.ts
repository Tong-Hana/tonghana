import type { HTMLAttributes } from "react";
import type { VariantProps } from "class-variance-authority";
import { tagVariants } from "@/components/common/tag/type/styles";

export interface TagProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tagVariants> {
  text: string;
  selectable?: boolean;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}
