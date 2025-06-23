import ChatRoom from "@/components/chat/ChatRoom";

const chatRoomDummy = [
  {
    roomId: 1,
    imageUrl: "/jennie.jpg",
    nickname: "성북동 제니",
    lastMessage: "안녕하세요..! 좋아요 감사합니다",
    lastMessageDate: new Date(),
  },
  {
    roomId: 2,
    imageUrl: "/jennie.jpg",
    nickname: "성북동 제니",
    lastMessage: "안녕하세요..! 좋아요 감사합니다",
    lastMessageDate: new Date(new Date().setDate(new Date().getDate() - 4)),
  },
  {
    roomId: 3,
    imageUrl: "/jennie.jpg",
    nickname: "성북동 제니",
    lastMessage: "안녕하세요..! 좋아요 감사합니다",
    lastMessageDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
  },
  {
    roomId: 4,
    imageUrl: "/jennie.jpg",
    nickname: "성북동 제니",
    lastMessage: "안녕하세요..! 좋아요 감사합니다",
    lastMessageDate: new Date(new Date().setFullYear(2024)),
  },
];

export default function ChatPage() {
  return (
    <div className="flex flex-col w-full h-full">
      {chatRoomDummy.map((chatroom) => (
        <ChatRoom
          key={chatroom.roomId}
          roomId={chatroom.roomId}
          imageUrl={chatroom.imageUrl}
          nickname={chatroom.nickname}
          lastMessage={chatroom.lastMessage}
          lastMessageDate={chatroom.lastMessageDate}
        />
      ))}
    </div>
  );
}
