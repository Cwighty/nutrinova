namespace NutrinovaData.Entities;

public partial class ChatMessage
{
  public Guid Id { get; set; }

  public Guid SessionId { get; set; }

  public string MessageText { get; set; } = null!;

  public bool Sentbycustomer { get; set; }

  public DateTime CreatedAt { get; set; }

  public virtual ChatSession Session { get; set; } = null!;
}
