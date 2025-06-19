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
