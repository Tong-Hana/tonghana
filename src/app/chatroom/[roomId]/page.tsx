"use client";

import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { Exit } from "@/assets/assets";
import Header from "@/components/common/Header";
// import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ChatInput from "@/components/chat/ChatInput";
import DialogButton from "@/components/common/button/DialogButton";
import AssetShareButton, {
  AssetShareStatus,
} from "@/components/chat/AssetShareButton";
import ChatMessageList, {
  MessageModel,
} from "@/components/chat/ChatMessageList";

export default function ChatRoomPage() {
  // const params = useParams();
  // const roomId = Number(params.roomId);
  const other = {
    nickname: "성동구 제니",
    imageUrl: "/jennie.jpg",
  };
  const shareStatus: AssetShareStatus = "pending";
  const showShareButton =
    shareStatus === "pending" || shareStatus === "other_agreed";
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = (behavior?: ScrollBehavior) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: behavior ?? "smooth",
      });
    }
  };

  const [messages, setMessages] = useState<MessageModel[]>([
    {
      message: "서비스 관련 문의가 있어요.",
      sender: "other",
      direction: "incoming",
      position: "single",
      createdAt: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    },
    {
      message: "안녕하세요. 무엇을 도와드릴까요?",
      sender: "me",
      direction: "outgoing",
      position: "single",
      createdAt: new Date(new Date().setDate(new Date().getDate() - 4)),
    },
    {
      message: "안녕하세요!",
      sender: "other",
      direction: "incoming",
      position: "single",
      createdAt: new Date(),
    },
  ]);

  // 새 메시지 있을 때 자동 스크롤
  useEffect(() => {
    scrollToBottom("instant");
  }, []);

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
      <Header title={other.nickname} scrollHide={false}>
        <DialogButton
          title={"채팅방을 나가시겠어요?"}
          content={"채팅방을 나가면 대화 기록이 모두 삭제됩니다."}
          onAction={() => {}}
        >
          <Exit className="mx-2 h-6 w-6 fill-hanablack" />
        </DialogButton>
      </Header>

      {/* 메시지 영역 (스크롤 가능) */}
      <ChatMessageList
        scrollRef={scrollRef}
        messages={messages}
        showShareButton={showShareButton}
        other={other}
      />

      {/* 하단 고정 입력창 */}
      <div className="fixed w-full bottom-0 left-0 z-10 flex flex-col gap-3 bg-transparent">
        {
          <AssetShareButton
            status={shareStatus}
            onAgree={() => {}}
            onReject={() => {}}
          />
        }
        <ChatInput inputRef={inputRef} onSend={handleSendMessage} />
      </div>
    </div>
  );
}
