import { ChatRoom } from "@/app/types/client-chat";
import { create } from "zustand";

interface ChatRoomState {
  chatRooms: ChatRoom[];
  setChatRooms: (chatRooms: ChatRoom[]) => void;
  updateRoom: (chatRoom: ChatRoom) => void;
}

export const useChatRoomStore = create<ChatRoomState>((set) => ({
  chatRooms: [],
  setChatRooms: (chatRooms: ChatRoom[]) => set({ chatRooms: chatRooms }),
  updateRoom: (chatRoom: ChatRoom) =>
    set((state) => {
      const others = state.chatRooms.filter(
        (r) => r.roomId !== chatRoom.roomId,
      );
      return {
        chatRooms: [chatRoom, ...others], // 최신 메시지 기준으로 정렬
      };
    }),
}));
