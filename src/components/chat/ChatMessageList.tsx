import { isSameDay, isSameMinute } from "date-fns";
import DateSeparator from "./ChatDateSeparater";
import ChatMessage from "./ChatMessage";
import { Ref } from "react";
import { cn } from "@/utils/cn";

export type MessageModel = {
  message: string;
  sender: string;
  direction: "incoming" | "outgoing";
  position: "single";
  createdAt: Date;
};

type Props = {
  scrollRef: Ref<HTMLDivElement>;
  messages: MessageModel[];
  showShareButton: boolean;
  other: {
    nickname: string;
    imageUrl: string;
  };
};

export default function ChatMessageList({
  scrollRef,
  messages,
  showShareButton,
  other,
}: Props) {
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
              other={m.direction === "incoming" ? other : undefined}
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
