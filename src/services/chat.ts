import { ChatRoom } from "@/app/types/client-chat";
export interface ChatRoomsResponse {
  chatRooms: ChatRoom[];
}

export const fetchChatRooms = async (): Promise<ChatRoomsResponse> => {
  const res = await fetch("/api/chats");

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message ?? "채팅방 목록 조회에 실패했습니다.");
  }

  const parsedData = await res.json();

  return {
    chatRooms: parsedData.chatRooms.map((chatRoom: ChatRoom) => ({
      ...chatRoom,
      lastMessageAt: new Date(chatRoom.lastMessageAt),
    })),
  };
};
