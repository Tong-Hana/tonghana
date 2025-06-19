import { Server } from "socket.io";
import { createServer } from "http";
import express from "express";
import { PrismaClient } from "@prisma/client";

// TODO: log 지우기
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
  path: "/socket.io",
});

const prisma = new PrismaClient();

io.on("connection", (socket) => {
  console.log("✅ 클라이언트 연결:", socket.id);

  socket.on("joinRoom", (roomId) => {
    socket.join(String(roomId));
    console.log(`🚪 Room joined: ${roomId}`);
  });

  // 메세지 보내기
  socket.on("sendMessage", async (msg) => {
    const { roomId, userId, message, regdate } = msg;

    try {
      const saved = await prisma.chatMessage.create({
        data: {
          roomId: Number(roomId),
          userId: Number(userId),
          message,
          regdate: new Date(regdate),
        },
      });

      await prisma.chatRoom.update({
        where: { roomId: Number(roomId) },
        data: {
          lastMessage: message,
          lastMessageAt: new Date(regdate),
        },
      });

      console.log("📝 메시지 저장 및 마지막 메시지 업데이트 완료:", saved);

      io.to(String(roomId)).emit("receiveMessage", saved);
    } catch (err) {
      console.error("❌ 메시지 저장 실패:", err);
      socket.emit("errorMessage", { message: "메시지 저장에 실패했습니다." });
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ 연결 종료:", socket.id);
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`🚀 채팅 서버 실행 중: http://localhost:${PORT}`);
});
