// Socket 연결 테스트용
"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

type Message = {
  roomId: string;
  userId: number;
  message: string;
  regdate: string;
};

export default function SocketTestPage() {
  const socketRef = useRef<Socket | null>(null);
  const [roomId, setRoomId] = useState("");
  const [message, setMessage] = useState("");
  const [chatList, setChatList] = useState<Message[]>([]);

  useEffect(() => {
    const socket = io({
      path: "/api/socket",
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("receiveMessage", (msg: Message) => {
      setChatList((prev) => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const joinRoom = () => {
    if (socketRef.current && roomId) {
      socketRef.current.emit("joinRoom", roomId);
      alert(`채팅방 ${roomId}에 입장했습니다.`);
    }
  };

  const sendMessage = () => {
    if (socketRef.current && message && roomId) {
      const msg = {
        roomId,
        userId: 199,
        message,
        regdate: new Date().toISOString(),
      };
      socketRef.current.emit("sendMessage", msg);
      setMessage("");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>💬 소켓 테스트</h1>

      <div>
        <input
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="Room ID"
        />
        <button onClick={joinRoom}>입장</button>
      </div>

      <div style={{ marginTop: 10 }}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="메시지 입력"
        />
        <button onClick={sendMessage}>전송</button>
      </div>

      <ul style={{ marginTop: 20 }}>
        {chatList.map((msg, idx) => (
          <li key={idx}>
            [{msg.userId}] {msg.message}
          </li>
        ))}
      </ul>
    </div>
  );
}
