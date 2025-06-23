import { create } from "zustand";

interface UserState {
  nickname: string | null;
  userId: number | null;
  setUser: (nickname: string, userId: number) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  nickname: null,
  userId: null,
  setUser: (nickname: string, userId: number) => set({ nickname, userId }),
  clearUser: () => set({ nickname: null, userId: null }),
}));
