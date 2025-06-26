import type { Server as HTTPServer } from "http";
import type { Server as IOServer, Socket as IOSocket } from "socket.io";
import type { NextApiResponse } from "next";

export interface NextApiResponseServerIO extends NextApiResponse {
  socket: NextApiResponse["socket"] & {
    server: HTTPServer & {
      io: IOServer;
    };
  };
}

// 채팅 메시지 구조
export interface SocketChatMessage {
  roomId: number;
  userId: number;
  message: string;
  regdate: string;
}
export interface SocketAssetShareStatus {
  roomId: number;
  userId: number;
  userId2: number;
  isAgree: boolean;
  isAgree2: boolean;
}

export interface ServerToClientEvents {
  receiveMessage: (message: SocketChatMessage) => void;
  connectUser: (userId: number) => void;
  disconnectUser: (userId: number) => void;
}

export interface ClientToServerEvents {
  sendMessage: (message: SocketChatMessage) => void;
  joinRoom: (roomId: number) => void;
  leaveRoom: (roomId: number) => void;
}

export type TypedSocket = IOSocket<ClientToServerEvents, ServerToClientEvents>;
