"use client";
import React, { useContext, useState, useEffect, useRef } from "react";
import {
  Paper,
  TextField,
  List,
  ListItem,
  Typography,
  Fab,
  InputAdornment,
  IconButton,
  Box,
} from "@mui/material";
import { ChatBotContext } from "@/context/ChatBotContext";
import {
  useGetChatsBySessionIdQuery,
  useGetNewChatSessionQuery,
  usePostChatMessageMutation,
} from "@/components/chatbot/chatBotHooks";
import {
  ChatMessageRequest,
  ChatMessageResponse,
} from "@/components/chatbot/chatBotModels";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import { Send } from "@mui/icons-material";

export const ChatBot = () => {
  const { sessionId, setSessionId } = useContext(ChatBotContext);
  const [showChatBot, setShowChatBot] = useState(false);
  const [messages, setMessages] = useState<ChatMessageResponse[]>([]);
  const [newMessage, setNewMessage] = useState<ChatMessageRequest>({
    messageText: "",
    sessionId: "",
  } as ChatMessageRequest);

  const {
    data: createSession,
    isLoading,
    isError,
  } = useGetNewChatSessionQuery();
  const { data: chatMessages } = useGetChatsBySessionIdQuery(createSession?.id);
  const { mutate: postChatMessageMutate } = usePostChatMessageMutation();

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (chatMessages) {
      const welcomeMessage = {
        messageText:
          "Hi! I'm NOVA, a chat bot designed to help you meet your nutritional goals. How can I help?",
        sender: "NOVA",
        sessionId: sessionId,
        createdAt: new Date().toString(),
      };
      const formattedMessages = chatMessages.map((msg) => ({
        messageText: msg.messageText,
        sender: msg.sender,
        sessionId: sessionId,
        createdAt: msg.createdAt,
      }));
      setMessages([welcomeMessage, ...formattedMessages]);
    }
  }, [chatMessages, sessionId]);

  const sendMessage = () => {
    if (newMessage.messageText.trim() !== "") {
      setMessages([
        ...messages,
        {
          messageText: newMessage.messageText,
          sender: "You",
          sessionId: sessionId,
          createdAt: new Date().toString(),
        },
      ]);
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
    if (messages.length === 0) {
      const welcomeMessage = {
        messageText:
          "Hi! I'm NOVA, a chat bot designed to help you meet your nutritional goals. How can I help?",
        sender: "NOVA",
        sessionId: sessionId,
        createdAt: new Date().toString(),
      };
      setMessages([welcomeMessage]);
    }
  }

  return (
    <>
      <Fab
        color="primary"
        aria-label="chat"
        sx={{ position: "fixed", bottom: { xs: 72, md: 16 }, right: 16 }}
        onClick={() => setShowChatBot(!showChatBot)}
      >
        <ChatBubbleIcon />
      </Fab>
      {showChatBot && (
        <Paper
          elevation={10}
          sx={{
            position: "fixed",
            bottom: { xs: 136, md: 80 },
            right: 16,
            p: 2,
            maxWidth: 400,
          }}
        >
          <List
            sx={{
              maxHeight: 400,
              overflow: "auto",
            }}
            subheader={<Typography variant="h6">NOVA Chat Bot</Typography>}
          >
            {messages.map((message, index) => (
              <>
                <Typography
                  variant="caption"
                  sx={{
                    px: 1,
                    pt: 1,
                    display: "flex",
                    justifyContent:
                      message.sender === "You" ? "flex-end" : "flex-start",
                  }}
                >
                  {message.sender}
                </Typography>
                <ListItem
                  key={index}
                  sx={{
                    display: "flex",
                    maxWidth: "90%",
                    justifyContent:
                      message.sender === "You" ? "flex-end" : "flex-start",
                    backgroundColor:
                      message.sender === "You"
                        ? "primary.dark"
                        : "background.default",
                    color: message.sender === "You" ? "white" : "text.primary",
                    borderRadius: "10px",
                    p: 1,
                    my: "5px",
                    marginLeft: message.sender === "You" ? "auto" : 0,
                    marginRight: message.sender === "NOVA" ? "auto" : 0,
                  }}
                >
                  <Typography variant="body1">{message.messageText}</Typography>
                </ListItem>
              </>
            ))}
            <Box ref={messagesEndRef} />
          </List>
          <TextField
            fullWidth
            multiline
            sx={{ my: 2 }}
            variant="outlined"
            placeholder="Type a message..."
            value={newMessage.messageText}
            onChange={handleMessageChange}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                sendMessage();
                event.preventDefault();
              }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={sendMessage} edge="end">
                    <Send />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Paper>
      )}
    </>
  );
};
