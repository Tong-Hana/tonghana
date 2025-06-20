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

  // 금지어 필터링
  const forbiddenWords = [
    "송금",
    "이체",
    "입금",
    "계좌번호",
    "계좌 이체",
    "무통장",
    "선입금",
    "선불",
    "선결제",
    "페이",
    "링크결제",
    "수수료",
    "돈 좀 빌려줘",
    "급하게 필요해",
    "급전",
    "안전결제",
    "보상",
    "고수익",
    "원금 보장",
    "믿고 투자",
    "투자 보장",
    "대출",
    "수술비",
    "입원비",
    "처방전",

    "주민등록번호",
    "신분증",
    "인증번호",
    "OTP",
    "카드번호",
    "보안카드",
    "공인인증서",
    "전화번호",
    "비밀번호",
    "메일주소",
    "이메일",
    "연락처",
    "본인인증",
    "계좌 인증",

    "통신이 안돼",
    "믿어줘",
    "내 말 안 믿어?",
    "믿지 않으면 넌 실망이야",
    "신고할 거야?",
    "더 이상 연락 안 해",

    "씨발",
    "시발",
    "ㅅㅂ",
    "ㅂㅅ",
    "병신",
    "지랄",
    "개새",
    "개새끼",
    "꺼져",
    "저능아",
    "찐따",
    "미친놈",
    "또라이",
    "븅",
    "븅신",
    "시발놈",
    "개노답",
    "노답",
    "빡쳐",
    "엿먹어",
    "죽여버려",
    "뒤질래",
    "존나",
    "ㅈㄴ",
  ];

  // 금지어 필터 함수
  function filterForbiddenWords(message: string): string {
    for (const word of forbiddenWords) {
      const regex = new RegExp(word, "gi");
      message = message.replace(regex, "*".repeat(word.length));
    }
    return message;
  }

  // 메세지 보내기
  socket.on("sendMessage", async (msg) => {
    const { roomId, userId, message: rawMessage, regdate } = msg;

    const filteredMessage = filterForbiddenWords(rawMessage);

    try {
      const saved = await prisma.chatMessage.create({
        data: {
          roomId: Number(roomId),
          userId: Number(userId),
          message: rawMessage,
          regdate: new Date(regdate),
        },
      });

      await prisma.chatRoom.update({
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
