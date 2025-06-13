import { cn } from "@/utils/cn";
import { tagVariants } from "@/components/common/tag/type/styles";
import type { TagProps } from "@/components/common/tag/type/types";

export default function StaticTag({
  text,
  variant = "filled",
  size = "md",
  disabled,
  className,
  ...props
}: TagProps) {
  return (
    <div
      className={cn(tagVariants({ variant, size, disabled }), className)}
      {...props}
    >
      {text}
    </div>
  );
}
