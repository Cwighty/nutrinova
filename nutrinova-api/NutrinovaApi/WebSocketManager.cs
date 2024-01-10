using System.Collections.Concurrent;
using System.Net.WebSockets;

namespace NutrinovaApi;

public class WebSocketManager
{
  private ConcurrentDictionary<string, WebSocket> _sockets = new ConcurrentDictionary<string, WebSocket>();

  public string AddSocket(WebSocket socket)
  {
    string connId = Guid.NewGuid().ToString(); // Unique ID for the new connection
    _sockets.TryAdd(connId, socket);
    return connId;
  }

  public async Task RemoveSocket(string id)
  {
    _sockets.TryRemove(id, out var socket);

    if (socket != null)
    {
      await socket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Closed by the WebSocketManager", CancellationToken.None);
    }
  }

  public async Task SendMessageToAllAsync(string message)
  {
    foreach (var pair in _sockets)
    {
      if (pair.Value.State == WebSocketState.Open)
      {
        await pair.Value.SendAsync(
            buffer: new ArraySegment<byte>(array: System.Text.Encoding.ASCII.GetBytes(message), offset: 0, count: message.Length),
            messageType: WebSocketMessageType.Text,
            endOfMessage: true,
            cancellationToken: CancellationToken.None);
      }
    }
  }

  public async Task EchoMessagesAsync(WebSocket webSocket, CancellationToken cancellationToken)
  {
    var buffer = new byte[1024 * 4];
    while (webSocket.State == WebSocketState.Open)
    {
      WebSocketReceiveResult? result = null;
      try
      {
        result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), cancellationToken);

        if (result.MessageType == WebSocketMessageType.Text)
        {
          string receivedMessage = System.Text.Encoding.UTF8.GetString(buffer, 0, result.Count);

          // Echo the message to all clients
          await SendMessageToAllAsync(receivedMessage);
        }
        else if (result.MessageType == WebSocketMessageType.Close)
        {
          await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Closing", cancellationToken);
          break;
        }
      }
      catch
      {
        if (webSocket.State != WebSocketState.Open)
        {
          break; // Exit the loop if the WebSocket is not open
        }
      }
    }

    // Remove the socket on close
    try
    {
      var socketId = _sockets.FirstOrDefault(p => p.Value == webSocket).Key;
      if (socketId != null)
      {
        await RemoveSocket(socketId);
      }
    }
    catch
    {
    }
  }
}
