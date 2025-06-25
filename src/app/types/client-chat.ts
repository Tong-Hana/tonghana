export type ChatRoom = {
  roomId: number;
  lastMessage: string;
  lastMessageAt: Date;
  opponent: {
    userId: number;
    nickname: string;
    profileUrl: string;
  };
};

export type ChatRoomInfo = {
  roomId: number;
  userId: number;
  userId2: number;
  isAgree: boolean;
  isAgree2: boolean;
};

export type ChatMessage = {
  messageId: number;
  userId: number;
  message: string;
  regdate: Date;
};

export type ChatMessageDisplay = {
  message: string;
  sender: "me" | "other";
  direction: "incoming" | "outgoing";
  position: "single";
  createdAt: Date;
  senderId?: number;
  senderNickname?: string;
  senderProfileImg?: string;
};

export enum AssetShareStatus {
  PENDING = "pending",
  ME_AGREED = "me_agreed",
  PARTNER_AGREED = "partner_agreed",
  BOTH_AGREED = "both_agreed",
  REJECTED = "rejected",
}
