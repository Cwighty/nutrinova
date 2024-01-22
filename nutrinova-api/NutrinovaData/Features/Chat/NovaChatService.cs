using OpenAI.Interfaces;
using OpenAI.ObjectModels;
using OpenAI.ObjectModels.RequestModels;
using ChatMessage = NutrinovaData.Entities.ChatMessage;
using OpenAIChatMessage = OpenAI.ObjectModels.RequestModels.ChatMessage;

namespace NutrinovaData.Features.Chat;

public class NovaChatService : INovaChatService
{
  private static string systemPrompt = @"
You are Nova, an expert nutritionist help bot.
You help people meet their nutritional goals. You can do this by
suggesting healthy foods that help meet nutritional requirements,
helping people convert food units and other calculations,
explaining details of nutritional terms, etc.";

  private readonly IOpenAIService openAiService;

  public NovaChatService(IOpenAIService openAI)
  {
    this.openAiService = openAI;
  }

  public async Task<ChatMessage> GetNextChatResponseAsync(IEnumerable<ChatMessage> messages)
  {
    List<OpenAIChatMessage> context = PrepareContext(messages);

    var chatRequest = new ChatCompletionCreateRequest
    {
      Messages = context,
      Model = Models.Gpt_3_5_Turbo,

      // MaxTokens = 50
    };

    var response = await openAiService.ChatCompletion.CreateCompletion(chatRequest);

    var textResponse = response.Choices.First().Message.Content;
    if (textResponse == null)
    {
      throw new Exception("Unable to get response");
    }

    return new ChatMessage
    {
      Id = Guid.NewGuid(),
      SessionId = messages.First().SessionId,
      MessageText = textResponse,
      CreatedAt = DateTime.UtcNow,
      Sentbycustomer = false,
    };
  }

  private List<OpenAIChatMessage> PrepareContext(IEnumerable<ChatMessage> messages)
  {
    var context = new List<OpenAIChatMessage>();
    context.Add(OpenAIChatMessage.FromSystem(systemPrompt));
    context.Add(OpenAIChatMessage.FromAssistant("Hi, I'm Nova a chat bot designed to help you meet your nutritional goals. How can I help?"));

    foreach (var m in messages)
    {
      if (m.Sentbycustomer)
      {
        context.Add(OpenAIChatMessage.FromUser(m.MessageText));
      }
      else
      {
        context.Add(OpenAIChatMessage.FromAssistant(m.MessageText));
      }
    }

    return context;
  }
}
