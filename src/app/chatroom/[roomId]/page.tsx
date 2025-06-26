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
import { SocketAssetShareStatus, SocketChatMessage } from "@/app/types/chat";
import { useChatPartnerInfo } from "@/hooks/chat/useChatPartnerInfo";
import { useChatRoomInfo } from "@/hooks/chat/useChatRoomInfo";
import { useSocket } from "@/hooks/chat/useSocket";
import LeaveChatRoomButton from "@/components/chat/LeaveChatRoomButton";
import ChatWarningModal from "@/components/chat/ChatWarningModal";
import ChatPortfolioButton from "@/components/chat/portfolio/ChatPortfolioButton";
import ChatPortfolioBottomSheet from "@/components/chat/portfolio/ChatPortfolioBottomSheet";
import ChatAssetShareModal from "@/components/chat/ChatAssetShareModal";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { parseToChatRoomInfo } from "@/utils/chat";

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
  const queryClient = useQueryClient();
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
  const [showAssetShareModal, setShowAssetShareModal] = useState(false);
  const [messages, setMessages] = useState<ChatMessageDisplay[]>([]);

  useEffect(() => {
    if (!roomId || !chatHistory || !myProfile || !chatPartner) return;

    const parsedMessages =
      chatHistory?.messages.map<ChatMessageDisplay>((message) => {
        const isMine = message.userId === myProfile.userId;
        return {
          message: message.message,
          direction: isMine ? "outgoing" : "incoming",
          position: "single",
          createdAt: message.regdate,
          sender: isMine ? "me" : "other",
          senderId: message.userId,
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
    const messageHandler = (msg: SocketChatMessage) => {
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
    // 메세지 리스너 등록
    socket.on("receiveMessage", messageHandler);

    // 자산 공유 상태 핸들러
    const assetShareStatusHandler = (status: SocketAssetShareStatus) => {
      const parsedStatus = parseToChatRoomInfo(myProfile.userId, status);

      queryClient.setQueryData(
        ["chatRoom", myProfile.userId, roomId],
        parsedStatus,
      );

      if (parsedStatus.agreeStatus === AssetShareStatus.PARTNER_AGREED) {
        toast.success(
          "상대가 자산 공유를 요청했어요.\n하단 버튼을 통해 공유 여부를 선택해주세요",
          { duration: 3000 },
        );
      }

      if (parsedStatus.agreeStatus === AssetShareStatus.BOTH_AGREED) {
        toast.success(
          "서로의 동의로 자산 공유가 완료되었습니다.\n상대의 프로필에서 총 자산을 확인하세요.",
          { duration: 3000 },
        );
      }
    };
    // 자산 공유 상태 리스너 등록
    socket.on("assetStatusChanged", assetShareStatusHandler);

    // 리스너 해제
    return () => {
      socket.off("receiveMessage", messageHandler);
      socket.off("assetStatusChanged", assetShareStatusHandler);
    };
  }, [myProfile, chatPartner, roomId, socket, queryClient]);

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
      {myProfile && roomInfo && showAssetShareModal && (
        <ChatAssetShareModal
          showModal={showAssetShareModal}
          onClose={() => setShowAssetShareModal(false)}
          myId={myProfile?.userId}
          roomId={roomId}
        />
      )}
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
              onOpenAssetShareModal={() => setShowAssetShareModal(true)}
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
