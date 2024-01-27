"use client";
import React, { createContext, useState, ReactNode } from "react";

interface ChatBotContextProps {
  sessionId: string;
  setSessionId: (id: string) => void;
}

export const ChatBotContext = createContext<ChatBotContextProps>({
  sessionId: "",
  setSessionId: () => {},
});

export const ChatBotProvider = ({ children }: { children: ReactNode }) => {
  const [sessionId, setSessionId] = useState("");

  return (
    <ChatBotContext.Provider value={{ sessionId, setSessionId }}>
      {children}
    </ChatBotContext.Provider>
  );
};
