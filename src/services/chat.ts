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

type ChatRoomInfoResponse = {
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

  let partnerId = null;
  let isAgreeMe = null;
  let isAgreePartner = null;
  let agreeStatus = AssetShareStatus.PENDING;

  if (parsedData.data.userId === myId) {
    partnerId = parsedData.data.userId2;
    isAgreePartner = parsedData.data.isAgree2;
    isAgreeMe = parsedData.data.isAgree;
  } else if (parsedData.data.userId2 === myId) {
    partnerId = parsedData.data.userId;
    isAgreePartner = parsedData.data.isAgree;
    isAgreeMe = parsedData.data.isAgree2;
  }

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
    myId: myId,
    partnerId: partnerId,
    agreeStatus: agreeStatus,
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

type ChatPartnerInfoResponse = {
  userId: number;
  nickname: string;
  profileImage: string;
};

export const fetchChatPartnerInfo = async (
  userId: number,
): Promise<ChatPartnerInfoResponse> => {
  const res = await fetch(`/api/match-cards/user-summary/${userId}`);

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message ?? "채팅 상대 정보 조회에 실패했습니다.");
  }

  const parsedData = await res.json();

  return {
    userId: parsedData.userId,
    nickname: parsedData.nickname,
    profileImage: parsedData.profileImage,
  };
};
