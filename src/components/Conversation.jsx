import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useSocketContext } from "../context/SocketContext";
import { extractTime } from "../utils/extractTime";

export const Conversation = ({ conversation, conv, setConv }) => {
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const { onlineUsers } = useSocketContext();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const decodedToken = jwtDecode(token);
      setLoggedInUserId(decodedToken.userId);
    }
  }, []);

  const otherParticipant = conversation.participants.find(
    (participant) => participant._id !== loggedInUserId
  );

  if (!otherParticipant) {
    return null; // Handle case where no other participant is found
  }

  // Check if the other participant is online
  const isOnline = onlineUsers.includes(otherParticipant._id);

  const handleConversationClick = () => {
    setConv(conversation);
    // Additional logic if needed
  };

  const truncateMessage = (message, maxLength = 20) => {
    if (message.length > maxLength) {
      return message.substring(0, maxLength) + "...";
    }
    return message;
  };

  const isSelected = conv?._id === conversation._id;
  const unread = conversation.unreadMessagesCount > 0;
  return (
    <>
      <div
        className={`flex gap-2 items-center hover:bg-secondary rounded p-2 py-1 cursor-pointer ${
          isSelected ? "bg-secondary" : ""
        } ${unread ? "font-bold" : ""}`}
        onClick={handleConversationClick}
      >
        <div className={`avatar ${isOnline ? "online" : ""}`}>
          <div className="w-12 rounded-full">
            <img src={otherParticipant.profilePic} alt="user avatar" />
          </div>
        </div>

        <div className="flex flex-col flex-1">
          <div className="flex justify-between flex-col">
            <p className="text-xl font-serif">{otherParticipant.username}</p>
            {conversation.lastMessage && (
              <div className="flex gap-3 justify-between">
                <p className="text-lg font-thin">
                  {truncateMessage(conversation.lastMessage.message)}
                </p>
                <p className="text-lg font-thin">
                  {extractTime(conversation.lastMessage.createdAt)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="divider my-0 py-0 h-1" />
    </>
  );
};
