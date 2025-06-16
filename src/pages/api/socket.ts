import type { NextApiRequest } from "next";
import type {
  NextApiResponseServerIO,
  TypedSocket,
} from "../../app/types/chat";
import { Server as IOServer } from "socket.io";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO,
) {
  if (!res.socket.server.io) {
    console.log("Socket.IO 서버 초기화 중");

    const io = new IOServer(res.socket.server, {
      path: "/api/socket",
    });

    io.on("connection", (socket: TypedSocket) => {
      console.log("클라이언트 연결됨:", socket.id);

      socket.on("joinRoom", (roomId) => {
        console.log(`룸 입장: ${roomId}`);
        socket.join(String(roomId));
      });

      socket.on("sendMessage", (message) => {
        console.log("메시지 수신:", message);
        io.to(String(message.roomId)).emit("receiveMessage", message);
      });

      socket.on("leaveRoom", (roomId) => {
        console.log(`룸 나감: ${roomId}`);
        socket.leave(String(roomId));
      });

      socket.on("disconnect", () => {
        console.log("클라이언트 연결 종료");
      });
    });

    res.socket.server.io = io;
  }

  res.end();
}
