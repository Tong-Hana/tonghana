import { isSameDay, isSameMinute } from "date-fns";
import DateSeparator from "./ChatDateSeparater";
import ChatMessage from "./ChatMessage";
import { Ref } from "react";
import { cn } from "@/utils/cn";
import { ChatMessageDisplay } from "@/app/types/client-chat";

type Props = {
  scrollRef: Ref<HTMLDivElement>;
  messages: ChatMessageDisplay[];
  showShareButton: boolean;
  isLoading: boolean;
  isError: boolean;
};

export default function ChatMessageList({
  scrollRef,
  messages,
  showShareButton,
  isLoading,
  isError,
}: Props) {
  if (isLoading || isError)
    return (
      <div className="flex flex-col items-center justify-center content-h text-text-secondary">
        {isLoading ? "채팅 불러오는 중..." : isError ? "에러 발생" : ""}
      </div>
    );

  return (
    <div
      ref={scrollRef}
      className={cn(
        "flex-1 overflow-y-scroll px-4 py-2 scrollbar-hide",
        showShareButton ? "pb-32" : "pb-20",
      )}
    >
      {messages.map((m, idx) => {
        const prev = messages[idx - 1];
        const next = messages[idx + 1];

        const showDate = !prev || !isSameDay(prev.createdAt, m.createdAt);

        const isFirstOfGroup =
          !prev ||
          !isSameMinute(prev?.createdAt, m.createdAt) ||
          prev?.direction !== m.direction;

        const isLastOfGroup =
          !next ||
          !isSameMinute(next?.createdAt, m.createdAt) ||
          next?.direction !== m.direction;

        return (
          <div key={idx}>
            {showDate && <DateSeparator date={m.createdAt} />}
            <ChatMessage
              message={m}
              showDate={showDate}
              isFirstOfGroup={isFirstOfGroup}
              isLastOfGroup={isLastOfGroup}
            />
          </div>
        );
      })}
    </div>
  );
}
