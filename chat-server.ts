import { Server } from "socket.io";
import { createServer } from "http";
import express from "express";
import { masterPrisma } from "./src/lib/prisma/masterClient";
import { filterForbiddenWords } from "./src/lib/filterForbiddenWords";

// TODO: log 지우기
const app = express();
app.use(express.json());

const server = createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
  path: "/socket.io",
});

app.post("/api/notify-asset-change", async (req, res) => {
  console.log("🔔 자산공개 변경 요청 수신:", req.body);
  const { roomId } = req.body;

  if (!roomId) {
    return res.status(400).json({ message: "roomId가 누락됨" });
  }

  const room = await masterPrisma.chatRoom.findUnique({
    where: { roomId: Number(roomId) },
    select: {
      roomId: true,
      userId: true,
      userId2: true,
      isAgree: true,
      isAgree2: true,
    },
  });

  io.to(String(roomId)).emit("assetStatusChanged", room);

  return res.status(200).json({ message: "자산 공개 상태 broadcast 완료" });
});

io.on("connection", (socket) => {
  console.log("✅ 클라이언트 연결:", socket.id);

  socket.on("joinRoom", (roomId) => {
    socket.join(String(roomId));
    console.log(`🚪 Room joined: ${roomId}`);
  });

  // 메세지 보내기
  socket.on("sendMessage", async (msg) => {
    const { roomId, userId, message: rawMessage, regdate } = msg;
    const filteredMessage = filterForbiddenWords(rawMessage);

    try {
      const saved = await masterPrisma.chatMessage.create({
        data: {
          roomId: Number(roomId),
          userId: Number(userId),
          message: rawMessage,
          regdate: new Date(regdate),
        },
      });

      await masterPrisma.chatRoom.update({
        where: { roomId: Number(roomId) },
        data: {
          lastMessage: filteredMessage,
          lastMessageAt: new Date(regdate),
        },
      });

      io.to(String(roomId)).emit("receiveMessage", {
        ...saved,
        message: filteredMessage,
      });
    } catch (err) {
      console.error("메시지 저장 실패:", err);
      socket.emit("errorMessage", { message: "메시지 저장에 실패했습니다." });
    }
  });

  socket.on("disconnect", () => {
    console.log("연결 종료:", socket.id);
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`🚀 채팅 서버 실행 중: http://localhost:${PORT}`);
});
