import { isSameDay, isSameMinute } from "date-fns";
import DateSeparator from "./ChatDateSeparater";
import ChatMessage from "./ChatMessage";
import { Ref } from "react";
import { ChatMessageDisplay } from "@/app/types/client-chat";

type Props = {
  scrollRef: Ref<HTMLDivElement>;
  messages: ChatMessageDisplay[];
  isLoading: boolean;
  isError: boolean;
};

export default function ChatMessageList({
  scrollRef,
  messages,
  isLoading,
  isError,
}: Props) {
  const reversedMessage = [...messages].reverse();

  if (isLoading || isError)
    return (
      <div className="flex flex-col items-center justify-center content-h text-text-secondary">
        {isLoading ? "채팅 불러오는 중..." : isError ? "에러 발생" : ""}
      </div>
    );

  return (
    <div
      ref={scrollRef}
      className="flex flex-col-reverse pb-32 overflow-y-scroll px-4 py-2 scrollbar-hide"
    >
      {reversedMessage.map((m, idx) => {
        const prev = reversedMessage[idx + 1];
        const next = reversedMessage[idx - 1];

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
