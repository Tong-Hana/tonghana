"use client";

import { PaperAirplane } from "@/assets/assets";
import { Ref, useState } from "react";
import ChatPreset from "./ChatPreset";
import { cn } from "@/utils/cn";

type Props = {
  inputRef: Ref<HTMLInputElement>;
  onSend: (text: string) => void;
};

export default function ChatInput({ inputRef, onSend }: Props) {
  const [text, setText] = useState("");
  const [showPreset, setShowPreset] = useState(false);

  const handleSend = () => {
    if (!text.trim()) return;

    onSend(text);
    setText("");
    setShowPreset(false);
  };

  const handleChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
    setShowPreset(event.target.value.trim().length > 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div>
      <div
        className={cn(
          "transition-all duration-300 transform",
          showPreset
            ? "max-h-40 opacity-100 translate-y-0"
            : "max-h-0 opacity-0 translate-y-40",
        )}
      >
        <ChatPreset onSelectPreset={setText} />
      </div>
      <div className="flex w-full px-5 py-3 gap-2 frame-container bg-background items-center">
        <input
          className="h-9 flex-grow rounded-lg bg-white px-3 text-sm text-text-primary border border-hanagreen-normal focus:border-2 focus:outline-none"
          ref={inputRef}
          value={text}
          onChange={handleChangeText}
          onKeyDown={handleKeyDown}
        />
        <button type="button" onClick={handleSend}>
          <PaperAirplane className="w-6 h-6 fill-hanagreen-normal" />
        </button>
      </div>
    </div>
  );
}
