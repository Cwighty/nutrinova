'use client'

import { NotificationContext } from "@/components/providers/NotificationProvider";
import { useContext } from "react";
import { Box } from "@mui/system";

export const WebSocketTest = () => {
  const notificationContext = useContext(NotificationContext);

  return (
    <Box sx={{ fontSize: "1px" }} onClick={() => notificationContext!.sendMessage("Hello World")}>
      Hello World
    </Box>
  )
}