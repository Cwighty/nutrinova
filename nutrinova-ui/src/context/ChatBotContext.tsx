// ChatSessionContext.tsx
import React, { createContext, useState, ReactNode } from "react";

// Define the shape of your context data
interface ChatBotContextProps {
  sessionId: string;
  setSessionId: (id: string) => void;
}

// Create the context with a default value
export const ChatBotContext = createContext<ChatBotContextProps>({
  sessionId: "",
  setSessionId: () => {},
});

// Create a provider component
export const ChatBotProvider = ({ children }: { children: ReactNode }) => {
  const [sessionId, setSessionId] = useState("");

  return (
    <ChatBotContext.Provider value={{ sessionId, setSessionId }}>
      {children}
    </ChatBotContext.Provider>
  );
};
