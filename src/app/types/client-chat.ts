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

export type ChatMessage = {
  messageId: number;
  userId: number;
  message: string;
  regdate: Date;
  sender: {
    nickname: string;
    profileUrl: string;
  };
};

export type ChatMessageDisplay = {
  message: string;
  sender: string;
  direction: "incoming" | "outgoing";
  position: "single";
  createdAt: Date;
  senderNickname?: string;
  senderProfileImg?: string;
};
