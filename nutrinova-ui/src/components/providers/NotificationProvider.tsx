'use client'
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import toast from 'react-hot-toast';

interface NotificationContextType {
  sendMessage: (message: string) => void;
}

export const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
  webSocketUrl?: string;
}

export interface NotificationMessage {
  message: string;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children, webSocketUrl }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const newSocket = new WebSocket(webSocketUrl ?? 'ws://localhost:5000/be/repeater');
    setSocket(newSocket);

    newSocket.onmessage = (event: MessageEvent) => {
      const notification: NotificationMessage = JSON.parse(event.data as string) as NotificationMessage;
      toast.success(notification.message);
    };

    newSocket.onclose = (event) => {
      if (event.wasClean) {
        console.log(`[websockets] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
      } else {
        console.log('[websockets] Connection died');
      }

      console.log('[websockets] Reconnecting...');
      setTimeout(() => {
        const reconnectSocket = new WebSocket(webSocketUrl ?? 'ws://localhost:5000/be/repeater');
        setSocket(reconnectSocket);
      }, 5000); // Attempt to reconnect every 5 seconds
    };

    return () => {
      newSocket.close();
    };
  }, [webSocketUrl]);

  const sendMessage = (message: string) => {
    const notification: NotificationMessage = {
      message: message
    };
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(notification));
    }
  };

  return (
    <NotificationContext.Provider value={{ sendMessage }}>
      {children}
    </NotificationContext.Provider>
  );
};
