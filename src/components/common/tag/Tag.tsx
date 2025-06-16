import type { TagProps } from "@/components/common/tag/type/types";
import StaticTag from "@/components/common/tag/type/StaticTag";
import InteractiveTag from "@/components/common/tag/type/InteractiveTag";

export default function Tag(props: TagProps) {
  if (props.selectable) {
    const cleanedProps = { ...props };
    delete cleanedProps.selectable;

    return <InteractiveTag {...cleanedProps} />;
  }

  return <StaticTag {...props} />;
}
