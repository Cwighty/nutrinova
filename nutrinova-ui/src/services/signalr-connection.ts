import * as signalR from "@microsoft/signalr";
const URL = process.env.WEBSOCKET_URL ?? "https://localhost:5000/repeater"; //or whatever your backend port is
export class Connector {
  private connection: signalR.HubConnection;
  public events: (onMessageReceived: (username: string, message: string) => void) => void;
  static instance: Connector;
  constructor() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(URL)
      .withAutomaticReconnect()
      .build();
    this.connection.start().catch(err => document.write(err as string));
    this.events = (onMessageReceived) => {
      this.connection.on("messageReceived", (username, message) => {
        onMessageReceived(username as string, message as string);
      });
    };
  }
  public newMessage = async (messages: string) => {
    await this.connection.send("newMessage", "foo", messages)
    console.log("sent")
  }
  public static getInstance(): Connector {
    if (!Connector.instance)
      Connector.instance = new Connector();
    return Connector.instance;
  }
}
export default void Connector.getInstance;