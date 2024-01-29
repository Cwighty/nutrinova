export interface NewChatSessionResponse {
  id: string;
  message: string;
}

export interface ChatMessageResponse {
  sender: string;
  messageText: string;
  sessionId: string;
  createdAt: string;
}

export interface ChatMessageRequest {
  sessionId: string;
  messageText: string;
}
