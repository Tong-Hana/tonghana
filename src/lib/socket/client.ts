import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;

export const getSocket = () => {
  if (!socket) {
    socket = io(socketUrl, {
      path: "/socket.io",
      transports: ["websocket"],
      autoConnect: false,
    });
  }
  return socket;
};
