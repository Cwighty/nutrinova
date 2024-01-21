using System;
using System.Collections.Generic;

namespace NutrinovaData.Entities;

public partial class ChatSession
{
    public Guid Id { get; set; }

    public Guid CreatedBy { get; set; }

    public virtual ICollection<ChatMessage> ChatMessages { get; set; } = new List<ChatMessage>();

    public virtual Customer CreatedByNavigation { get; set; } = null!;
}
