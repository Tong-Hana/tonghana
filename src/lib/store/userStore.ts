import { create } from "zustand";

interface UserState {
  nickname: string | null;
  setNickname: (nickname: string) => void;
  clearNickname: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  nickname: null,
  setNickname: (nickname: string) => set({ nickname }),
  clearNickname: () => set({ nickname: null }),
}));
