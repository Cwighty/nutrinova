'use client'

import { NotificationContext } from "@/components/providers/NotificationProvider";
import { Button } from "@mui/material";
import { useContext } from "react";

export const WebSocketTest = () => {
  const notificationContext = useContext(NotificationContext);

  return (
    <Button variant="contained" color="primary" onClick={() => notificationContext!.sendMessage("Hello World")}>
      Hello World
    </Button>
  )
}