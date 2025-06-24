import { cn } from "@/utils/cn";
import { formatTime } from "@/utils/dateformatter";
import { Message } from "@chatscope/chat-ui-kit-react";
import ChatProfileImage from "./ChatProfileImage";
import { ChatMessageDisplay } from "@/app/types/client-chat";

type Props = {
  message: ChatMessageDisplay;
  showDate: boolean;
  isFirstOfGroup: boolean;
  isLastOfGroup: boolean;
};

export default function ChatMessage({
  message,
  isFirstOfGroup,
  isLastOfGroup,
}: Props) {
  const isIncoming = message.direction === "incoming";
  const showProfile = isIncoming && isFirstOfGroup && message.senderProfileImg;

  return (
    <div
      className={cn(
        "mt-1 items-end",
        isIncoming ? "flex mr-10" : "flex flex-row-reverse ml-10",
      )}
    >
      {/* 상대방 이미지 (상대방 그룹의 첫번째 메세지일 경우만) */}
      {isIncoming &&
        (showProfile ? (
          <div className="self-start mr-2">
            <ChatProfileImage
              size={37}
              imageUrl={message.senderProfileImg ?? ""}
            />
          </div>
        ) : (
          <div className="mr-2 w-[37px] h-[37px]" />
        ))}
      {/* 메세지 및 상대방 닉네임 */}
      {showProfile ? (
        <div className="flex flex-col mt-3">
          <div className="text-xs text-text-primary">
            {message.senderNickname}
          </div>
          <Message model={message} />
        </div>
      ) : (
        <Message model={message} />
      )}

      {/* 전송 시간 (그룹의 마지막 메세지일 경우만) */}
      {isLastOfGroup && (
        <div
          className={cn(
            "flex-none mt-1 text-xs text-text-secondary",
            isIncoming ? "ml-1 text-left" : "mr-1 text-right",
          )}
        >
          {formatTime(message.createdAt, "a hh:mm")}
        </div>
      )}
    </div>
  );
}
