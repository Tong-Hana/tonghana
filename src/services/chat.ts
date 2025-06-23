import {
  AssetShareStatus,
  ChatMessage,
  ChatRoom,
} from "@/app/types/client-chat";

type ChatRoomsResponse = {
  chatRooms: ChatRoom[];
};

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

const parseToChatRoomInfoResponse = (
  myId: number,
  data: {
    roomId: number;
    userId: number;
    userId2: number;
    isAgree?: boolean;
    isAgree2?: boolean;
  },
): ChatRoomInfoResponse => {
  let partnerId = null;
  let isAgreeMe = null;
  let isAgreePartner = null;
  let agreeStatus = AssetShareStatus.PENDING;

  if (data.userId === myId) {
    partnerId = data.userId2;
    isAgreePartner = data.isAgree2;
    isAgreeMe = data.isAgree;
  } else if (data.userId2 === myId) {
    partnerId = data.userId;
    isAgreePartner = data.isAgree;
    isAgreeMe = data.isAgree2;
  }

  if (!partnerId) throw new Error("유효하지 않은 접근입니다.");

  if (isAgreeMe === true && isAgreePartner === true) {
    // 둘다 동의
    agreeStatus = AssetShareStatus.BOTH_AGREED;
  } else if (isAgreeMe === true && isAgreePartner === null) {
    // 나는 동의 상대방은 대기
    agreeStatus = AssetShareStatus.ME_AGREED;
  } else if (isAgreePartner === true && isAgreeMe === null) {
    // 나는 대기 상대방은 동의
    agreeStatus = AssetShareStatus.PARTNER_AGREED;
  } else if (isAgreeMe === false || isAgreePartner === false) {
    // 나 또는 상대방이 거절
    agreeStatus = AssetShareStatus.REJECTED;
  } else {
    // 둘다 대기
    agreeStatus = AssetShareStatus.PENDING;
  }

  return {
    roomId: data.roomId,
    myId: myId,
    partnerId: partnerId,
    agreeStatus: agreeStatus,
  };
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

  const chatRoomResponse = parseToChatRoomInfoResponse(myId, parsedData.data);

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

  const chatRoomResponse = parseToChatRoomInfoResponse(myId, parsedData.data);

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

  const chatRoomResponse = parseToChatRoomInfoResponse(myId, parsedData.data);

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
