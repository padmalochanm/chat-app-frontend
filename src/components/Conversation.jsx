import { useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";
import { useConversation } from "../context/ConversationContext";
import { useSocketContext } from "../context/SocketContext";

export const Conversation = ({ conversation }) => {
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const { setSelectedConversation, selectedConversation } = useConversation();
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
  console.log(isOnline);

  const handleConversationClick = () => {
    setSelectedConversation(conversation);
    // Additional logic if needed
  };

  const isSelected = selectedConversation?._id === conversation._id;

  return (
    <>
      <div
        className={`flex gap-2 items-center hover:bg-secondary rounded p-2 py-1 cursor-pointer ${
          isSelected ? "bg-secondary" : ""
        }`}
        onClick={handleConversationClick}
      >
        <div className={`avatar ${isOnline ? "online" : ""}`}>
          <div className="w-12 rounded-full">
            <img src={otherParticipant.profilePic} alt="user avatar" />
          </div>
        </div>

        <div className="flex flex-col flex-1">
          <div className="flex gap-3 justify-between">
            <p className="text-xl font-serif">
              {otherParticipant.username}
            </p>
          </div>
        </div>
      </div>

      <div className="divider my-0 py-0 h-1" />
    </>
  );
};
