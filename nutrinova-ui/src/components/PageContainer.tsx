import React, { useState } from "react";
import { Container, Divider, Fab } from "@mui/material";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import PageBar from "@/components/PageBar";
import { ReactNode } from "react";
import { ChatBot } from "@/components/chatbot/ChatBot";

interface PageContainerProps {
  children: ReactNode;
  title: string;
}

export const PageContainer = ({ children, title }: PageContainerProps) => {
  const [showChatBot, setShowChatBot] = useState(false);

  const toggleChatBot = () => {
    setShowChatBot(!showChatBot);
  };

  return (
    <>
      <PageBar title={title} />
      <Divider />
      <Container maxWidth={"lg"} sx={{ pt: 3, pb: { xs: 3, md: 0 } }}>
        {children}
      </Container>
      <Fab
        color="primary"
        aria-label="chat"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        onClick={toggleChatBot}
      >
        <ChatBubbleIcon />
      </Fab>
      {showChatBot && <ChatBot />}
    </>
  );
};
