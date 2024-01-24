// Create a new chat session
import createAuthenticatedAxiosInstanceFactory from "@/services/axiosRequestFactory";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  ChatMessageResponse,
  ChatMessageRequest,
  NewChatSessionResponse,
} from "@/components/chatbot/chatBotModels";
import { ChatBotContext } from "@/context/ChatBotContext";
import { useContext } from "react";

const createChatSession = async () => {
  const apiClient = await createAuthenticatedAxiosInstanceFactory({
    additionalHeaders: {},
    origin: "client",
  });
  const response = await apiClient.get("/chat/new-session");
  return response.data as NewChatSessionResponse;
};

export const useCreateChatSessionMutation = () => {
  const chatBotContext = useContext(ChatBotContext);
  return useMutation({
    mutationFn: createChatSession,
    onSuccess: (data) => {
      toast.success("Chat session created successfully: " + data.id);
      chatBotContext.setSessionId(data.id);
    },
    onError: (error) => {
      toast.error("Error creating chat session: " + error.message);
      console.error(error);
    },
  });
};

// Fetch chat messages by session ID
const getChatsBySessionId = async (sessionId: string) => {
  const apiClient = await createAuthenticatedAxiosInstanceFactory({
    additionalHeaders: {},
    origin: "client",
  });
  const response = await apiClient.get(`/chat/${sessionId}`);
  return response.data as ChatMessageResponse[];
};

export const useGetChatsBySessionIdQuery = (sessionId: string) => {
  return useQuery({
    queryKey: ["chatMessages", sessionId],
    queryFn: () => getChatsBySessionId(sessionId),
  });
};

// Post a new chat message
const postChatMessage = async (message: {
  sessionId: string;
  messageText: string;
}) => {
  const apiClient = await createAuthenticatedAxiosInstanceFactory({
    additionalHeaders: {},
    origin: "client",
  });
  const response = await apiClient.post("/chat", message);
  return response.data as ChatMessageRequest;
};

export const usePostChatMessageMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postChatMessage,
    onSuccess: async () => {
      toast.success("Message sent successfully");
      // Invalidate and refetch chat messages
      await queryClient.invalidateQueries({ queryKey: ["chatMessages"] });
    },
    onError: (error) => {
      toast.error("Error sending message: " + error.message);
      console.error(error);
    },
  });
};
