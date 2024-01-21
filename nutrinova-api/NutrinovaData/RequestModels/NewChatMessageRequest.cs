namespace NutrinovaData.RequestModels;

public class NewChatMessageRequest
{
  public Guid SessionId { get; set; }
  public string MessageText { get; set; } = null!;
}
