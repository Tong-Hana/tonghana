"use client";

import { useEffect, useRef, useState } from "react";
import socket from "@/lib/socket/client";
import { useParams } from "next/navigation";

type Message = {
  roomId: string;
  userId: number;
  message: string;
  regdate: string;
};

export default function ChatRoomPage() {
  const { chatRoomId } = useParams() as { chatRoomId: string };
  const [message, setMessage] = useState("");
  const [chatList, setChatList] = useState<Message[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/profiles/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.userId) {
          setUserId(data.userId);
        }
      })
      .catch((err) => console.error("유저 정보 가져오기 실패", err));
  }, []);

  useEffect(() => {
    if (!chatRoomId) return;

    socket.emit("joinRoom", chatRoomId);

    fetch(`/api/chats/${chatRoomId}/messages`)
      .then((res) => res.json())
      .then((data) => {
        if (data.messages) {
          setChatList(data.messages);
        }
      })
      .catch((err) => {
        console.error("채팅 메시지 불러오기 실패", err);
      });

    socket.on("receiveMessage", (msg: Message) => {
      setChatList((prev) => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, [chatRoomId]);

  // 스크롤 아래로 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatList]);

  const sendMessage = () => {
    if (!message.trim() || userId === null) return;

    socket.emit("sendMessage", {
      roomId: chatRoomId,
      userId,
      message,
      regdate: new Date().toISOString(),
    });
    setMessage("");
  };

  return (
    <div
      style={{
        padding: 20,
        fontFamily: "sans-serif",
        color: "black",
        backgroundColor: "#f7f7f7",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ marginBottom: 20 }}>채팅방: {chatRoomId}</h1>

      <div style={{ marginBottom: 20 }}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="메시지 입력"
          style={{
            color: "black",
            border: "1px solid black",
            padding: 8,
            marginRight: 10,
            width: 300,
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            color: "black",
            border: "1px solid black",
            padding: "8px 16px",
            backgroundColor: "white",
            cursor: "pointer",
          }}
        >
          전송
        </button>
      </div>

      <ul
        style={{
          border: "1px solid black",
          padding: 12,
          maxHeight: 300,
          overflowY: "auto",
          backgroundColor: "white",
          color: "black",
          listStyle: "none",
        }}
      >
        {chatList.map((msg, idx) => (
          <li key={idx} style={{ marginBottom: 8 }}>
            <strong>[{msg.userId}]</strong> {msg.message} {msg.regdate}
          </li>
        ))}
        <div ref={messagesEndRef} />
      </ul>
    </div>
  );
}
