import { format } from "date-fns";
import { ko } from "date-fns/locale";

export default function DateSeparator({ date }: { date: Date }) {
  return (
    <div className="flex items-center my-4">
      <div className="border-b flex-grow px-5 self-center" />
      <span className="text-xs text-text-secondary  px-5 py-1 ">
        {format(date, "yyyy년 M월 d일 (E)", { locale: ko })}
      </span>
      <div className="border-b flex-grow px-5 self-center" />
    </div>
  );
}
