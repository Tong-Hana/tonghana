import { Exit } from "@/assets/assets";
import Header from "@/components/common/Header";

type Props = {
  roomId: string;
};

export default async function ChatRoomPage({
  params,
}: {
  params: Promise<Props>;
}) {
  const roomId = parseInt((await params).roomId);

  return (
    <div>
      <Header
        title={`채팅방${roomId.toString()}`} // 상대방 이름 표시
        scrollHide={false}
      >
        <button className="py-2 px-2 z-10 cursor-pointer" type="button">
          <Exit className="w-6 h-6 fill-hanablack" />
        </button>
      </Header>
    </div>
  );
}
