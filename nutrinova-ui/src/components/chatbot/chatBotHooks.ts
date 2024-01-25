// Create a new chat session
import createAuthenticatedAxiosInstanceFactory from "@/services/axiosRequestFactory";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  ChatMessageResponse,
  ChatMessageRequest,
  NewChatSessionResponse,
} from "@/components/chatbot/chatBotModels";

const createChatSession = async () => {
  const apiClient = await createAuthenticatedAxiosInstanceFactory({
    additionalHeaders: {},
    origin: "client",
  });
  const response = await apiClient.get("/chat/new-session");
  return response.data as NewChatSessionResponse;
};

export const useGetNewChatSessionQuery = () => {
  return useQuery({
    queryKey: ["newChatSession"],
    queryFn: () => createChatSession(),
  });
};

const getChatsBySessionId = async (sessionId?: string) => {
  const apiClient = await createAuthenticatedAxiosInstanceFactory({
    additionalHeaders: {},
    origin: "client",
  });
  const response = await apiClient.get(`/chat/${sessionId}`);
  return response.data as ChatMessageResponse[];
};

export const useGetChatsBySessionIdQuery = (sessionId?: string) => {
  return useQuery({
    queryKey: ["chatMessages", sessionId],
    queryFn: () => getChatsBySessionId(sessionId),
    enabled: !!sessionId,
  });
};

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
