"use client";

import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import Header from "@/components/common/Header";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ChatInput from "@/components/chat/ChatInput";
import AssetShareButton from "@/components/chat/AssetShareButton";
import { useMyProfile } from "@/hooks/useMyProfile";
import { useChatMessages } from "@/hooks/chat/useChatMessages";
import { AssetShareStatus, ChatMessageDisplay } from "@/app/types/client-chat";
import ChatMessageList from "@/components/chat/ChatMessageList";
import { SocketChatMessage } from "@/app/types/chat";
import { useChatPartnerInfo } from "@/hooks/chat/useChatPartnerInfo";
import { useChatRoomInfo } from "@/hooks/chat/useChatRoomInfo";
import { useSocket } from "@/hooks/chat/useSocket";
import LeaveChatRoomButton from "@/components/chat/LeaveChatRoomButton";
import ChatWarningModal from "@/components/chat/ChatWarningModal";
import ChatPortfolioButton from "@/components/chat/portfolio/ChatPortfolioButton";
import ChatPortfolioBottomSheet from "@/components/chat/portfolio/ChatPortfolioBottomSheet";

export default function ChatRoomPage() {
  const params = useParams();
  const roomId = Number(params.roomId);

  const {
    data: myProfile,
    isLoading: isLoadingProfile,
    isError: isErrorProfile,
  } = useMyProfile();
  const {
    data: roomInfo,
    isLoading: isLoadingRoomInfo,
    isError: isErrorRoomInfo,
  } = useChatRoomInfo(myProfile?.userId, roomId);
  const {
    data: chatPartner,
    isLoading: isLoadingChatPartner,
    isError: isErrorChatPartner,
  } = useChatPartnerInfo(roomInfo?.partnerId);
  const {
    data: chatHistory,
    isLoading: isLoadingChats,
    isError: isErrorChats,
  } = useChatMessages(roomId);

  const showShareButton =
    roomInfo?.agreeStatus === AssetShareStatus.PENDING ||
    roomInfo?.agreeStatus === AssetShareStatus.PARTNER_AGREED;

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const socket = useSocket();

  const isLoading =
    isLoadingChats ||
    isLoadingProfile ||
    isLoadingChatPartner ||
    isLoadingRoomInfo;
  const isError =
    isErrorChats || isErrorProfile || isErrorChatPartner || isErrorRoomInfo;

  const scrollToBottom = (behavior?: ScrollBehavior) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: behavior ?? "smooth",
      });
    }
  };
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [messages, setMessages] = useState<ChatMessageDisplay[]>([]);

  useEffect(() => {
    if (!roomId || !chatHistory || !myProfile || !chatPartner) return;

    const parsedMessages =
      chatHistory?.messages.map<ChatMessageDisplay>((message) => {
        const isMine = message.userId === myProfile.userId;
        return {
          message: message.message,
          sender: isMine ? "me" : "other",
          direction: isMine ? "outgoing" : "incoming",
          position: "single",
          createdAt: message.regdate,
          senderNickname: isMine ? undefined : chatPartner?.nickname,
          senderProfileImg: isMine ? undefined : chatPartner?.profileImage,
        };
      }) ?? [];

    setMessages(parsedMessages);
  }, [roomId, chatHistory, myProfile, chatPartner]);

  useEffect(() => {
    // 채팅방 입장
    socket.emit("joinRoom", roomId);

    return () => {
      socket.emit("leaveRoom", roomId);
    };
  }, [roomId, socket]);

  useEffect(() => {
    if (!myProfile || !chatPartner) return;

    // 메세지 핸들러
    const handler = (msg: SocketChatMessage) => {
      const isMine = msg.userId === myProfile.userId;

      setMessages((prev) => [
        ...prev,
        {
          message: msg.message,
          sender: isMine ? "me" : "other",
          direction: isMine ? "outgoing" : "incoming",
          position: "single",
          createdAt: new Date(Date.parse(msg.regdate)),
          senderNickname: isMine ? undefined : chatPartner?.nickname,
          senderProfileImg: isMine ? undefined : chatPartner?.profileImage,
        },
      ]);
    };

    // 메세지 리스너
    socket.on("receiveMessage", handler);

    // 메세지 리스너 해제
    return () => {
      socket.off("receiveMessage", handler);
    };
  }, [myProfile, chatPartner, socket]);

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
      <ChatWarningModal />
      {/* 상단 고정 헤더 */}
      <Header title={chatPartner?.nickname ?? ""} scrollHide={false}>
        <LeaveChatRoomButton roomId={roomId} />
      </Header>

      {/* 메시지 영역 (스크롤 가능) */}
      {
        <ChatMessageList
          scrollRef={scrollRef}
          messages={messages}
          showShareButton={showShareButton}
          isLoading={isLoading}
          isError={isError}
        />
      }

      {/* 하단 고정 입력창 */}
      <div
        className="fixed frame-container bottom-0 flex flex-col gap-3 bg-transparent"
        style={{ zIndex: 5 }}
      >
        <div className="flex w-full items-center">
          <div className="ml-5 flex items-center ">
            {myProfile && chatPartner && (
              <ChatPortfolioButton onOpen={() => setShowBottomSheet(true)} />
            )}
          </div>
          <div className="absolute left-1/2 -translate-x-1/2">
            <AssetShareButton
              status={roomInfo?.agreeStatus ?? AssetShareStatus.REJECTED}
              myId={myProfile?.userId}
              roomId={roomId}
            />
          </div>
        </div>
        <ChatInput inputRef={inputRef} onSend={handleSendMessage} />
      </div>
      {myProfile && chatPartner && (
        <ChatPortfolioBottomSheet
          open={showBottomSheet}
          partnerNickname={chatPartner.nickname}
          myPortfolioData={myProfile.categoryRatios}
          partnerPortfolioData={chatPartner.categoryRatios}
          onClose={() => setShowBottomSheet(false)}
        />
      )}
    </div>
  );
}
