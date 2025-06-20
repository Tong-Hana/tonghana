import { useEffect } from "react";
import { getSocket } from "@/lib/socket/client";

export const useSocket = () => {
  const socket = getSocket();

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      if (socket.connected) {
        socket.disconnect();
      }
    };
  }, [socket]);

  return socket;
};
