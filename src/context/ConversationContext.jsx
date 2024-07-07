import { createContext, useContext, useState } from "react";

const ConversationContext = createContext();

export const useConversation = () => {
  const context = useContext(ConversationContext);
  if (!context) {
    throw new Error("useConversation must be used within a ConversationProvider");
  }
  return context;
};

export const ConversationProvider = ({ children }) => {
  const [selectedConversation, setSelectedConversation] = useState(null);

  return (
    <ConversationContext.Provider
      value={{
        selectedConversation,
        setSelectedConversation,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
};
