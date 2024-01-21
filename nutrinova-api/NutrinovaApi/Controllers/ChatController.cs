using Microsoft.IdentityModel.Tokens;
using NutrinovaData.Features.Chat;

namespace NutrinovaApi.Controllers;

[ApiController]
[Route("/be/[controller]")]
public class ChatController : ControllerBase
{
  private readonly NutrinovaDbContext context;
  private readonly INovaChatService chatService;
  private readonly ILogger<ChatController> logger;

  public ChatController(NutrinovaDbContext context, INovaChatService chatService, ILogger<ChatController> logger)
  {
    this.context = context;
    this.chatService = chatService;
    this.logger = logger;
  }

  [HttpGet("new-session")]
  public async Task<ActionResult> CreateNewChatSessionAsync()
  {
      var userObjectId = User.GetObjectIdFromClaims();
      var customer = await context.Customers.FirstOrDefaultAsync(c => c.Objectid == userObjectId);
      if (customer is null || customer?.Id is null)
      {
        return Unauthorized();
      }

      var session = new ChatSession
      {
        Id = Guid.NewGuid(),
        CreatedBy = customer.Id,
      };

      await context.ChatSessions.AddAsync(session);
      await context.SaveChangesAsync();

      logger.LogInformation("New chat session started {sessionId}", session.Id);
      return Ok(new { message = "Chat session created successfully", id = session.Id });
  }

  [HttpGet("{sessionId}")]
  public async Task<ActionResult<IEnumerable<ChatMessage>>> GetChats(Guid sessionId)
  {
      var userObjectId = User.GetObjectIdFromClaims();
      var customer = await context.Customers.FirstOrDefaultAsync(c => c.Objectid == userObjectId);
      if (customer is null || customer?.Id is null)
      {
        return Unauthorized();
      }

      var session = await context.ChatSessions
          .Include(s => s.ChatMessages)
          .FirstOrDefaultAsync(s => s.Id == sessionId && s.CreatedBy == customer.Id);

      if (session is null)
      {
        return NotFound();
      }

      return Ok(session.ChatMessages);
  }

  [HttpPost]
  public async Task<ActionResult<IEnumerable<ChatMessageResponse>>> PostChatMessage(NewChatMessageRequest request)
  {
    if (request.MessageText.IsNullOrEmpty())
    {
      return BadRequest("Message text was empty");
    }

    var userObjectId = User.GetObjectIdFromClaims();
    var customer = await context.Customers.FirstOrDefaultAsync(c => c.Objectid == userObjectId);
    if (customer is null || customer?.Id is null)
    {
      return Unauthorized();
    }

    var session = await context.ChatSessions
        .Include(s => s.ChatMessages)
        .FirstOrDefaultAsync(s => s.Id == request.SessionId && s.CreatedBy == customer.Id);

    if (session is null)
    {
      return NotFound();
    }

    var message = new ChatMessage()
    {
      Id = Guid.NewGuid(),
      SessionId = request.SessionId,
      MessageText = request.MessageText,
      Sentbycustomer = true,
      CreatedAt = DateTime.UtcNow,
    };

    session.ChatMessages.Add(message);
    var response = await chatService.GetNextChatResponseAsync(session.ChatMessages);

    await context.ChatMessages.AddAsync(response);
    await context.SaveChangesAsync();

    return Ok(session.ChatMessages.ToResponseModels());
  }
}
