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
import { getSocket } from "@/lib/socket/client";
import { SocketChatMessage } from "@/app/types/chat";

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
  const socket = getSocket();

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
    if (!chatHistory || !myProfile || !roomId) return;

    // 채팅방 입장
    socket.emit("joinRoom", roomId);

    // 메세지 리스너
    socket.on("receiveMessage", (msg: SocketChatMessage) => {
      setMessages((prev) => [
        ...prev,
        {
          message: msg.content,
          sender: msg.userId === myProfile.userId ? "me" : "other",
          direction: msg.userId === myProfile.userId ? "outgoing" : "incoming",
          position: "single",
          createdAt: new Date(Date.parse(msg.sentAt)),
        },
      ]);
    });

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

    // 가장 최신 채팅으로 스크롤
    setTimeout(() => scrollToBottom("instant"), 0);

    // 채팅방 연결 종료
    return () => {
      socket.disconnect();
    };
  }, [roomId, chatHistory, myProfile]);

  const handleSendMessage = (message: string) => {
    if (!myProfile) return;

    socket.emit("sendMessage", {
      roomId: roomId,
      userId: myProfile.userId,
      message,
      regdate: new Date().toISOString(),
    });

    inputRef.current?.focus();
    setTimeout(() => scrollToBottom(), 200);
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
