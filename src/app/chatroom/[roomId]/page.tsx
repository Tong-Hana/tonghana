"use client";

import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { Exit } from "@/assets/assets";
import Header from "@/components/common/Header";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ChatInput from "@/components/chat/ChatInput";
import DialogButton from "@/components/common/button/DialogButton";
import AssetShareButton, {
  AssetShareStatus,
} from "@/components/chat/AssetShareButton";
import { useMyProfile } from "@/hooks/useMyProfile";
import { useChatMessages } from "@/hooks/useChatMessages";
import { ChatMessageDisplay } from "@/app/types/client-chat";
import ChatMessageList from "@/components/chat/ChatMessageList";

export default function ChatRoomPage() {
  const params = useParams();
  const roomId = Number(params.roomId);
  const {
    data: myProfile,
    isLoading: isLoadingProfile,
    isError: isErrorProfile,
  } = useMyProfile();
  const {
    data: chatHistory,
    isLoading: isLoadingChats,
    isError: isErrorChats,
  } = useChatMessages(roomId);
  const shareStatus: AssetShareStatus = "pending";
  const showShareButton =
    shareStatus === "pending" || shareStatus === "other_agreed";
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showExitDialog, setShowExitDialog] = useState(false);

  const scrollToBottom = (behavior?: ScrollBehavior) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: behavior ?? "smooth",
      });
    }
  };

  const [messages, setMessages] = useState<ChatMessageDisplay[]>([]);

  const openExitDialog = () => {
    setShowExitDialog(true);
  };

  const closeExitDialog = () => {
    setShowExitDialog(false);
  };

  useEffect(() => {
    if (!chatHistory || !myProfile) return;
    const parsedMessages =
      chatHistory?.messages.map<ChatMessageDisplay>((message) => ({
        message: message.message,
        sender: message.userId !== myProfile?.userId ? "other" : "me",
        direction:
          message.userId !== myProfile?.userId ? "incoming" : "outgoing",
        position: "single",
        createdAt: message.regdate,
        senderNickname: message.sender.nickname,
        senderProfileImg: message.sender.profileUrl,
      })) ?? [];

    setMessages(parsedMessages);

    setTimeout(() => scrollToBottom("instant"), 0);
  }, [chatHistory, myProfile]);

  const handleSendMessage = (text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        message: text,
        sender: "me",
        direction: "outgoing",
        position: "single",
        createdAt: new Date(),
      },
    ]);
    inputRef.current?.focus();
    setTimeout(() => scrollToBottom(), 30);
  };

  return (
    <div className="h-[100dvh] flex flex-col scrollbar-hide">
      {/* 상단 고정 헤더 */}
      <Header title={""} scrollHide={false}>
        <DialogButton
          title={"채팅방을 나가시겠어요?"}
          content={"채팅방을 나가면 대화 기록이 모두 삭제됩니다."}
          open={showExitDialog}
          onAction={() => {}}
          onClose={closeExitDialog}
        >
          <button type="button" onClick={openExitDialog}>
            <Exit className="mx-2 h-6 w-6 fill-hanablack" />
          </button>
        </DialogButton>
      </Header>

      {/* 메시지 영역 (스크롤 가능) */}
      {
        <ChatMessageList
          scrollRef={scrollRef}
          messages={messages}
          showShareButton={showShareButton}
          isLoading={isLoadingChats || isLoadingProfile}
          isError={isErrorChats || isErrorProfile}
        />
      }

      {/* 하단 고정 입력창 */}
      <div className="fixed w-full bottom-0 left-0 z-10 flex flex-col gap-3 bg-transparent">
        <AssetShareButton
          status={shareStatus}
          onAgree={() => {}}
          onReject={() => {}}
        />
        <ChatInput inputRef={inputRef} onSend={handleSendMessage} />
      </div>
    </div>
  );
}
