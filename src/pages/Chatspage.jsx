import SearchBar from "../components/SearchBar";
import { Conversation } from "../components/Conversation";
import { useEffect, useState } from "react";
import axios from "axios";
import MessageContainer from "../components/MessageContainer";

const Chatspage = () => {
  const [conversations, setConversations] = useState([]);

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
      setConversations(response.data);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  const handleSelectUser = async (user) => {
    try {
      const token = localStorage.getItem("authToken");
      const headers = { Authorization: `Bearer ${token}` };
      await axios.post(
        "https://chat-app-backend-k80s.onrender.com/api/users/conversations",
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
      <div className="hero-content flex flex-row-reverse h-full w-full">
        <div className="card bg-base-100 flex-grow shrink-0 shadow-2xl h-full p-5">
          <MessageContainer />
        </div>
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl h-full p-5 flex flex-col">
          <SearchBar onSelectUser={handleSelectUser} />
          <div className="flex-grow overflow-auto">
            {conversations.map((conversation) => (
              <div key={conversation._id}>
                <Conversation conversation={conversation} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatspage;
