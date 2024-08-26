import { Conversation } from "../components/Conversation";
import { useEffect, useState } from "react";
import axios from "axios";
import MessageContainer from "../components/MessageContainer";
import { useConversation } from "../context/ConversationContext";
import Search from "../components/Search";

const Chatspage = () => {
  const [conversations, setConversations] = useState([]);
  const { selectedConversation, setSelectedConversation } = useConversation();

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No token found");
      }
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(
        "https://chat-app-backend-k80s.onrender.com/api/users/conversations",
        { headers }
      );
      const sortedConversations = response.data.sort((a, b) => {
        if (!a.lastMessage && !b.lastMessage) {
          return 0; // Both have no lastMessage, so they are equal
        }
        if (!a.lastMessage) {
          return -1; // a comes before b if a has no lastMessage
        }
        if (!b.lastMessage) {
          return 1; // b comes before a if b has no lastMessage
        }
        // Both have lastMessage, so sort by createdAt
        return (
          new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt)
        );
      });
      setConversations(sortedConversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  const handleSelectUser = async (user) => {
    try {
      const token = localStorage.getItem("authToken");
      const headers = { Authorization: `Bearer ${token}` };
      await axios.post(
        "http://localhost:8000/api/users/conversations",
        { userId: user._id },
        { headers }
      );
      window.location.reload(); // Reload conversations after adding a new one
    } catch (error) {
      console.error("Error creating/fetching conversation:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      fetchConversations();
    }
  }, []);

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex flex-col md:flex-row h-full w-full">
        {/* Desktop View: Conversations List */}
        <div
          className={`card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl h-full p-5 ${
            selectedConversation ? "hidden" : "flex"
          } hidden md:flex flex-col`}
        >
          <Search onSelectUser={handleSelectUser} />
          <div className="message-list flex-grow min-screen overflow-y-auto">
            {conversations.map((conversation) => (
              <div
                key={conversation._id}
                className="text-base sm:text-xs md:text-xl lg:text-2xl"
              >
                <Conversation
                  conversation={conversation}
                  conv={selectedConversation}
                  setConv={setSelectedConversation}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop View: MessageContainer */}
        <div className="card bg-base-100 flex-grow shrink-0 shadow-2xl h-full p-5 hidden md:flex">
          <MessageContainer conv={selectedConversation} />
        </div>

        {/* Mobile View: Conversations List */}
        <div
          className={`block md:hidden ${
            selectedConversation ? "hidden" : "flex"
          } flex-grow h-full card bg-base-100 w-full`}
        >
          <div className="w-full h-full flex flex-col p-5">
            <Search onSelectUser={handleSelectUser} />
            <div className="message-list flex-grow min-screen overflow-y-auto">
              {conversations.map((conversation) => (
                <div
                  key={conversation._id}
                  className="text-base sm:text-xs md:text-xl lg:text-2xl"
                >
                  <Conversation
                    conversation={conversation}
                    conv={selectedConversation}
                    setConv={setSelectedConversation}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile View: MessageContainer */}
        <div
          className={`block md:hidden ${
            selectedConversation ? "flex" : "hidden"
          } flex-grow h-full card bg-base-100 w-full`}
        >
          <MessageContainer conv={selectedConversation} />
        </div>
      </div>
    </div>
  );
};

export default Chatspage;
