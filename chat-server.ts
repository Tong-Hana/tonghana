import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
  path: "/socket.io",
});

const prisma = new PrismaClient();

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Socket 채팅 서버 API",
      version: "1.0.0",
      description: "Socket.IO 기반 채팅 서버의 메시지 이벤트 문서입니다.",
    },
  },
  apis: ["./chat-server.ts"], // 주석에서 API 추출
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * components:
 *   schemas:
 *     SendMessage:
 *       type: object
 *       required:
 *         - roomId
 *         - userId
 *         - message
 *         - regdate
 *       properties:
 *         roomId:
 *           type: integer
 *           example: 1
 *         userId:
 *           type: integer
 *           example: 42
 *         message:
 *           type: string
 *           example: "안녕하세요!"
 *         regdate:
 *           type: string
 *           format: date-time
 *           example: "2025-06-17T15:00:00Z"

 *     ReceiveMessage:
 *       allOf:
 *         - $ref: '#/components/schemas/SendMessage'
 *         - type: object
 *           properties:
 *             messageId:
 *               type: integer
 *               example: 101

 * paths:
 *   /socket/sendMessage:
 *     post:
 *       summary: [SOCKET] 메시지 전송 (Socket.IO)
 *       description: |
 *         클라이언트가 소켓으로 `sendMessage` 이벤트를 보낼 때의 데이터 구조입니다.  
 *         실제로는 HTTP 요청이 아니라 WebSocket을 통해 전송됩니다.
 *       tags: [Socket]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SendMessage'
 *       responses:
 *         200:
 *           description: 서버에서 broadcasting 되는 메시지 형식
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ReceiveMessage'
 */

io.on("connection", (socket) => {
  console.log("클라이언트 연결:", socket.id);

  socket.on("joinRoom", (roomId) => {
    socket.join(String(roomId));
    console.log(`Room joined: ${roomId}`);
  });

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

      console.log("메시지 저장 및 마지막 메시지 업데이트 완료");

      io.to(String(roomId)).emit("receiveMessage", saved);
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
  console.log(`채팅 서버 실행: http://localhost:${PORT}`);
  console.log(`Swagger 문서: http://localhost:${PORT}/docs`);
});
