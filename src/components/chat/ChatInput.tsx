"use client";

import { PaperAirplane } from "@/assets/assets";
import { Ref, useState } from "react";

type Props = {
  inputRef: Ref<HTMLInputElement>;
  onSend: (text: string) => void;
};

export default function ChatInput({ inputRef, onSend }: Props) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;

    onSend(text);
    setText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex w-full px-5 py-3 gap-2 frame-container bg-background items-center">
      <input
        className="h-9 flex-grow rounded-lg bg-white px-3 text-sm text-text-primary border border-hanagreen-normal focus:border-2 focus:outline-none"
        ref={inputRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button type="button" onClick={handleSend}>
        <PaperAirplane className="w-6 h-6 fill-hanagreen-normal" />
      </button>
    </div>
  );
}
