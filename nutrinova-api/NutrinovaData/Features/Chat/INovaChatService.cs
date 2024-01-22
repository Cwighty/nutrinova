using ChatMessage = NutrinovaData.Entities.ChatMessage;

namespace NutrinovaData.Features.Chat;

public interface INovaChatService
{
  Task<ChatMessage> GetNextChatResponseAsync(IEnumerable<ChatMessage> messages);
}
