import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:8080", {
  reconnection: true, // Allow reconnection
  reconnectionAttempts: 10, // Max reconnection attempts
  reconnectionDelay: 3000, // Delay between reconnects (3 seconds)
});

export const useSocket = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect(); // Ensure socket connects
    }

    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    socket.on("processComplete", (result) => {
      setData(result);
      setLoading(false);
    });

    return () => {
      console.log("Cleaning up socket listeners...");
      socket.off("processComplete"); // Remove event listeners instead of disconnecting
    };
  }, []);

  const startProcessing = () => {
    setLoading(true);
    socket.emit("startProcess");
  };

  return { data, loading, startProcessing };
};
