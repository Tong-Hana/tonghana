"use client";

import { ChatRoom } from "@/app/types/client-chat";
import ChatRoomTile from "@/components/chat/ChatRoom";
import { useChatRooms } from "@/hooks/useChatRooms";

export default function ChatPage() {
  const { data, isLoading, isError, error } = useChatRooms();

  if (isLoading) return <p>채팅방 불러오는 중...</p>;
  if (isError) return <p>에러 발생: {(error as Error).message}</p>;
  if (data?.chatRooms.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center"
        // 전체 화면 크기에 헤더와 바텀바 높이 뺀 크기
        style={{ height: "calc(100vh - 48px - 48px)" }}
      >
        <p className="text-text-secondary text-base ">
          아직 만들어진 채팅방이 없어요.
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
