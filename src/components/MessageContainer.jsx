import MessageInput from "./MessageInput";
import { BsArrowBarLeft } from "react-icons/bs";
import { TiMessages } from "react-icons/ti";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { extractTime } from "../utils/extractTime.js";
import { useSocketContext } from "../context/SocketContext";

const MessageContainer = ({conv}) => {
  const { socket } = useSocketContext();
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [otherParticipant, setOtherParticipant] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Function to add a new message to the state for a specific conversation
  const addMessage = (newMessage) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  const renderMessageWithLinks = (message) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return message.split(urlRegex).map((part, index) => {
      if (part.match(urlRegex)) {
        return <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 underline">{part}</a>;
      } else {
        return part;
      }
    });
  };

  // Function to fetch messages for a specific conversation
  const fetchMessages = async (conversationId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(
        `https://chat-app-backend-k80s.onrender.com/api/messages/${conversationId}`,
        { headers }
      );
      setMessages(response.data.messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (conv) {
      fetchMessages(conv._id);
      //console.log(conv);
    }
  }, [conv]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const decodedToken = jwtDecode(token);
      setLoggedInUserId(decodedToken.userId);
    }

    if (conv) {
      const participant = conv.participants.find(
        (participant) => participant._id !== loggedInUserId
      );
      setOtherParticipant(participant);
    }
  }, [conv, loggedInUserId]);

  useEffect(() => {
    const handleNewMessage = (newMessage) => {
      // Add the new message to the state
      addMessage(newMessage);
      // Scroll to the bottom of the messages list
      scrollToBottom();
    };

    // Listen for "newMessage" event from socket
    socket.on("newMessage", handleNewMessage);

    return () => {
      // Clean up socket event listener
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, addMessage]);

  // Scroll to the bottom of the messages list
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!loading) {
      scrollToBottom();
    }
  }, [messages, loading]);

  return (
    <div className="flex flex-col min-h-screen">
      {!conv ? (
        <NoChatSelected />
      ) : (
        <div className="min-h-screen">
          <div className="navbar bg-base-100 flex flex-row ">
            <div className="flex-1">
              <button
                className="btn btn-square btn-ghost text-2xl"
                onClick={() => {
                  window.location.reload(); // Clear selected conversation
                }}
              >
                <BsArrowBarLeft />
              </button>
            </div>
            <div className="flex-none flex items-center">
              <img
                src={otherParticipant?.profilePic}
                alt="Profile"
                className="w-12 rounded-full mr-2"
              />
              <p className="text-xl font-serif">{otherParticipant?.username}</p>
            </div>
          </div>
          <div className="flex-grow overflow-auto">
            {loading ? (
              <p>Loading messages...</p>
            ) : (
              <div className="message-list flex-grow min-screen overflow-y-auto p-4">
                {/* Render messages for the selected conversation */}
                {messages.map((message) => (
                  <div
                    key={message._id}
                    className={`chat ${
                      message.senderId === loggedInUserId
                        ? "chat-end"
                        : "chat-start"
                    } mb-2`}
                  >
                    <p
                      className={`chat-bubble ${
                        message.senderId === loggedInUserId
                          ? "chat-bubble-primary"
                          : "chat-bubble-accent"
                      }`}
                    >
                      {renderMessageWithLinks(message.message)}
                    </p>
                    <span className="text-sm text-gray-500">
                      {extractTime(message.createdAt)}
                    </span>
                  </div>
                ))}
                <div ref={messagesEndRef} /> {/* Reference to scroll to */}
              </div>
            )}
          </div>
          <div className="sticky bottom-0">
            <MessageInput
              addMessage={addMessage}
              receiverId={otherParticipant?._id}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageContainer;

const NoChatSelected = () => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          const headers = {
            Authorization: `Bearer ${token}`,
          };

          const response = await axios.get(
            "http://chat-app-backend-k80s.onrender.com/api/users/me",
            {
              headers,
            }
          );

          setUserName(response.data.username);
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      }
    };

    fetchUserDetails();
  }, []);

  return (
    <div className="items-center justify-center w-full h-full hidden md:flex">
      <div className="px-4 text-center sm:text-lg md:text-xl font-semibold flex flex-col items-center gap-2">
        <p>Welcome 👋 {userName} ❄</p>
        <p>Select a chat to start messaging</p>
        <TiMessages className="text-3xl md:text-6xl text-center" />
      </div>
    </div>
  );
};
