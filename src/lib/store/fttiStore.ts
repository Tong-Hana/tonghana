import { create } from "zustand";

export type FttiAnswer = number | number[] | null;

interface FttiState {
  selectedAnswers: FttiAnswer[];
  setAnswer: (questionIndex: number, answer: number | number[]) => void;
  clearAnswers: () => void;
  isComplete: () => boolean;
}

export const useFttiStore = create<FttiState>((set, get) => ({
  selectedAnswers: Array(8).fill(null),

  setAnswer: (questionIndex: number, answer: number | number[]) =>
    set((state) => {
      const updated = [...state.selectedAnswers];
      updated[questionIndex] = answer;
      return { selectedAnswers: updated };
    }),

  clearAnswers: () => set({ selectedAnswers: Array(8).fill(null) }),

  isComplete: () => {
    const { selectedAnswers } = get();
    return selectedAnswers.every((ans) => {
      if (Array.isArray(ans)) return ans.length > 0;
      return ans !== null;
    });
  },
}));
