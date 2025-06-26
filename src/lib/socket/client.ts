import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket) {
    socket = io("http://3.35.57.215/:3001", {
      path: "/socket.io",
      transports: ["websocket"],
      autoConnect: false,
    });
  }
  return socket;
};
