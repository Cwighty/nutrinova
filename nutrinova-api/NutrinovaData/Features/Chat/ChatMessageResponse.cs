namespace NutrinovaData.Features.Chat;

public class ChatMessageResponse
{
  public string Sender { get; set; } = string.Empty;

  public string MessageText { get; set; } = string.Empty;

  public Guid SessionId { get; set; }

  public DateTime CreatedAt { get; set; }
}
