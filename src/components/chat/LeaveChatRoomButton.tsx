"use client";

import { useState } from "react";
import DialogButton from "../common/button/DialogButton";
import { Exit } from "@/assets/assets";
import { useLeaveChatRoom } from "@/hooks/chat/useLeaveChatRoom";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type Props = {
  roomId: number;
};

export default function LeaveChatRoomButton({ roomId }: Props) {
  const [showExitDialog, setShowExitDialog] = useState(false);
  const router = useRouter();

  const openExitDialog = () => {
    setShowExitDialog(true);
  };

  const closeExitDialog = () => {
    setShowExitDialog(false);
  };

  const leaveChatRoomMutation = useLeaveChatRoom(
    () => {
      router.back();
    },
    (error) => {
      toast.error(error.message ?? "채팅방 나가기에 실패했습니다.");
    },
  );

  const handleLeaveChatRoom = async () => {
    leaveChatRoomMutation.mutate(roomId);
  };

  return (
    <DialogButton
      title={"채팅방을 나가시겠어요?"}
      content={"채팅방을 나가면 대화 기록이 모두 삭제됩니다."}
      open={showExitDialog}
      onAction={handleLeaveChatRoom}
      onClose={closeExitDialog}
    >
      <button type="button" onClick={openExitDialog}>
        <Exit className="mx-2 h-6 w-6 fill-hanablack" />
      </button>
    </DialogButton>
  );
}
