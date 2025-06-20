"use client";

import { ChatRoom } from "@/app/types/client-chat";
import ChatRoomTile from "@/components/chat/ChatRoom";
import { useChatRooms } from "@/hooks/useChatRooms";

export default function ChatPage() {
  const { data, isLoading, isError, error } = useChatRooms();

  if (isLoading || isError || data?.chatRooms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center content-h">
        <p className="text-text-secondary text-base ">
          {isLoading
            ? "채팅방 불러오는 중..."
            : isError
              ? `에러 발생: ${(error as Error).message}`
              : "아직 만들어진 채팅방이 없어요."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full">
      {data?.chatRooms.map((chatroom: ChatRoom) => (
        <ChatRoomTile
          key={chatroom.roomId}
          roomId={chatroom.roomId}
          imageUrl={chatroom.opponent.profileUrl}
          nickname={chatroom.opponent.nickname}
          lastMessage={chatroom.lastMessage}
          lastMessageDate={chatroom.lastMessageAt}
        />
      ))}
    </div>
  );
}
