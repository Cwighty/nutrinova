using NutrinovaData.Entities;

namespace NutrinovaData.Features.Chat;

public static class ChatMessageExtensions
{
  public static IEnumerable<ChatMessageResponse> ToResponseModels(this IEnumerable<ChatMessage> chatMessages)
  {
    return chatMessages.Select(chatMessage => new ChatMessageResponse
    {
      SessionId = chatMessage.SessionId,
      MessageText = chatMessage.MessageText,
      Sender = chatMessage.Sentbycustomer ? "You" : "NOVA",
      CreatedAt = chatMessage.CreatedAt,
    }).OrderBy(cm => cm.CreatedAt);
  }
}
