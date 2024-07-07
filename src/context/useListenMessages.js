import { useEffect } from "react";
import { useSocketContext } from "./SocketContext";

const useListenMessages = (initialMessages, updateMessages) => {
  const { socket } = useSocketContext();

  useEffect(() => {
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      newMessage.shouldShake = true; // Example modification
      updateMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off("newMessage");
    };
  }, [socket, updateMessages]);
};

export default useListenMessages;
