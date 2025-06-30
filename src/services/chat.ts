import {
  AssetShareStatus,
  ChatMessage,
  ChatRoom,
} from "@/app/types/client-chat";
import { parseToChatRoomInfo } from "@/utils/chat";

export type ChatRoomsResponse = {
  chatRooms: ChatRoom[];
};

export const fetchChatRooms = async (): Promise<ChatRoomsResponse> => {
  const res = await fetch("/api/chats");

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message ?? "채팅방 목록 조회에 실패했습니다.");
  }

  const parsedData = (await res.json()) as ChatRoomsResponse;

  return {
    chatRooms: parsedData.chatRooms
      .map((chatRoom: ChatRoom) => ({
        ...chatRoom,
        lastMessageAt:
          chatRoom.lastMessageAt && new Date(chatRoom.lastMessageAt),
      }))
      .sort((a, b) => {
        // null이 가장 위로 오도록 정렬
        if (!a.lastMessageAt && !b.lastMessageAt) return 0;
        if (!a.lastMessageAt) return -1;
        if (!b.lastMessageAt) return 1;
        return b.lastMessageAt.getTime() - a.lastMessageAt.getTime(); // 최신순
      }),
  };
};

type ChatMessagesResponse = {
  messages: ChatMessage[];
};

export const fetchChatMessages = async (
  roomId: number,
): Promise<ChatMessagesResponse> => {
  const res = await fetch(`/api/chats/${roomId}/messages`);

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message ?? "채팅방 목록 조회에 실패했습니다.");
  }

  const parsedData = await res.json();

  return {
    messages: parsedData.messages.map((message: ChatMessage) => ({
      ...message,
      regdate: new Date(message.regdate),
    })),
  };
};

export type ChatRoomInfoResponse = {
  roomId: number;
  myId: number;
  partnerId: number;
  agreeStatus: AssetShareStatus;
};

export const fetchChatRoomInfo = async (
  myId: number,
  roomId: number,
): Promise<ChatRoomInfoResponse> => {
  const res = await fetch(`/api/chats/${roomId}`);

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message ?? "채팅방 정보 조회에 실패했습니다.");
  }

  const parsedData = await res.json();

  const chatRoomResponse = parseToChatRoomInfo(myId, parsedData.data);

  return chatRoomResponse;
};

export const acceptAssetShare = async (
  myId: number,
  roomId: number,
): Promise<ChatRoomInfoResponse> => {
  const res = await fetch(`/api/chats/${roomId}/assets/accept`, {
    method: "PATCH",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message ?? "자산 공유 수락에 실패했습니다.");
  }

  const parsedData = await res.json();

  const chatRoomResponse = parseToChatRoomInfo(myId, parsedData.data);

  return chatRoomResponse;
};

export const rejectAssetShare = async (
  myId: number,
  roomId: number,
): Promise<ChatRoomInfoResponse> => {
  const res = await fetch(`/api/chats/${roomId}/assets/reject`, {
    method: "PATCH",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message ?? "자산 공유 거절에 실패했습니다.");
  }

  const parsedData = await res.json();

  const chatRoomResponse = parseToChatRoomInfo(myId, parsedData.data);

  return chatRoomResponse;
};

export const leaveChatRoom = async (roomId: number): Promise<void> => {
  const res = await fetch(`/api/chats/${roomId}/leave`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message ?? "채팅방 나가기에 실패했습니다.");
  }
};
