import { formatSmartDate } from "@/utils/dateformatter";
import Link from "next/link";
import ChatProfileImage from "./ChatProfileImage";

type Props = {
  roomId: number;
  imageUrl: string;
  nickname: string;
  lastMessage?: string;
  lastMessageDate?: Date;
};

export default function ChatRoomTile({
  roomId,
  imageUrl,
  nickname,
  lastMessage,
  lastMessageDate,
}: Props) {
  return (
    <Link href={`/chatroom/${roomId}`}>
      <div className="flex px-5 gap-2 items-center hover:bg-hanagreen-light">
        <ChatProfileImage imageUrl={imageUrl} size={50} />
        <div className="py-4 flex flex-1 flex-col gap-1 text-text-primary border-b border-b-hanagreen-light-active">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium flex-1">{nickname}</p>
            <p className="text-[10px] font-light text-text-secondary">
              {formatSmartDate(lastMessageDate ?? new Date())}
            </p>
          </div>
          <p className="text-xs font-light">
            {lastMessage ?? "아직 메세지가 없습니다."}
          </p>
        </div>
      </div>
    </Link>
  );
}
