"use client";
import React, { useContext, useState, useEffect } from "react";
import {
  Paper,
  TextField,
  Button,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import { ChatBotContext, ChatBotProvider } from "@/context/ChatBotContext";
import {
  useGetChatsBySessionIdQuery,
  useGetNewChatSessionQuery,
  usePostChatMessageMutation,
} from "@/components/chatbot/chatBotHooks";
import {
  ChatMessageRequest,
  ChatMessageResponse,
} from "@/components/chatbot/chatBotModels";

export const ChatBot = () => {
  const { sessionId, setSessionId } = useContext(ChatBotContext);
  const [messages, setMessages] = useState<ChatMessageResponse[]>([]);
  const [newMessage, setNewMessage] = useState<ChatMessageRequest>({
    messageText: "",
    sessionId: "",
  } as ChatMessageRequest);

  // Hooks
  const {
    data: createSession,
    isLoading,
    isError,
  } = useGetNewChatSessionQuery();
  const { data: chatMessages } = useGetChatsBySessionIdQuery(createSession?.id);
  const { mutate: postChatMessageMutate } = usePostChatMessageMutation();

  // Update messages when new chats are fetched
  useEffect(() => {
    if (chatMessages) {
      const formattedMessages = chatMessages.map((msg) => ({
        messageText: msg.messageText,
        sender: msg.sender ? "user" : "bot",
        sessionId: sessionId,
        createdAt: msg.createdAt,
      }));
      setMessages(formattedMessages);
    }
  }, [chatMessages, sessionId]);

  const sendMessage = () => {
    if (newMessage.messageText.trim() !== "") {
      // Add user message to the chat
      setMessages([
        ...messages,
        {
          messageText: newMessage.messageText,
          sender: "user",
          sessionId: sessionId,
          createdAt: new Date().toString(),
        },
      ]);
      // Send message to server
      postChatMessageMutate({
        sessionId,
        messageText: newMessage.messageText,
      });
      setNewMessage({
        messageText: "",
        sessionId: sessionId,
      } as ChatMessageRequest);
    }
  };

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage({
      messageText: event.target.value,
      sessionId: sessionId,
    } as ChatMessageRequest);
  };

  if (createSession?.id && !isLoading && !isError) {
    setSessionId(createSession.id);
    console.log("Session ID: ", createSession.id);
    console.log("Session ID: ", sessionId);
  }

  return (
    <Paper
      elevation={3}
      sx={{ position: "fixed", bottom: 80, right: 16, p: 2, maxWidth: 300 }}
    >
      <List>
        {messages.map((message, index) => (
          <ListItem
            key={index}
            sx={{
              display: "flex",
              justifyContent:
                message.sender === "user" ? "flex-end" : "flex-start",
              backgroundColor:
                message.sender === "user" ? "primary" : "secondary",
              borderRadius: "10px",
              padding: "10px",
              margin: "5px 0",
            }}
          >
            <Typography variant="body1">{message.messageText}</Typography>
          </ListItem>
        ))}
      </List>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Type a message..."
        value={newMessage.messageText}
        onChange={handleMessageChange}
        onKeyPress={(event) => {
          if (event.key === "Enter") {
            sendMessage();
            event.preventDefault();
          }
        }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={sendMessage}
        sx={{ marginTop: 1 }}
      >
        Send
      </Button>
    </Paper>
  );
};
