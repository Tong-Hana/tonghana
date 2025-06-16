import { formatSmartDate } from "@/utils/dateformatter";
import Image from "next/image";
import Link from "next/link";

type Props = {
  roomId: number;
  imageUrl: string;
  nickname: string;
  lastMessage: string;
  lastMessageDate: Date;
};

export default function ChatRoom({
  roomId,
  imageUrl,
  nickname,
  lastMessage,
  lastMessageDate,
}: Props) {
  return (
    <Link href={`/chatroom/${roomId}`}>
      <div className="flex px-5 gap-2 items-center hover:bg-hanagreen-light">
        <div className="w-[50px] h-[50px] relative rounded-full overflow-hidden">
          <Image src={imageUrl} alt="profile" fill className="object-cover" />
        </div>
        <div className="py-4 flex flex-1 flex-col gap-1 text-text-primary border-b border-b-hanagreen-light-active">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium flex-1">{nickname}</p>
            <p className="text-[10px] font-light text-text-secondary">
              {formatSmartDate(lastMessageDate)}
            </p>
          </div>
          <p className="text-xs font-light">{lastMessage}</p>
        </div>
      </div>
    </Link>
  );
}
