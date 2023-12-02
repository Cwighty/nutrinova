'use client'
import React from 'react';
import GenericCard from './GenericCard';
import { List, ListItem, ListItemText, IconButton } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CloseIcon from '@mui/icons-material/Close';

// Define the structure of your notifications
interface Notification {
  id: number;
  message: string;
}

// Fake JSON data for notifications
const notificationsData: Notification[] = [
  { id: 1, message: 'Your report is ready to view.' },
  { id: 2, message: 'New updates are available.' },
  { id: 3, message: 'You have a new message from your healthcare provider.' },
];

const NotificationsCard: React.FC = () => {
  // This would be replaced with state management in a real application
  const [notifications, setNotifications] = React.useState<Notification[]>(notificationsData);

  const handleDismiss = (id: number) => {
    // In a real application, you might update the state or make an API call to dismiss the notification
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  return (
    <GenericCard title="Notifications" icon={<NotificationsIcon />}>
      <List>
        {notifications.length === 0 && <ListItem><ListItemText primary="No notifications" /></ListItem>}
        {notifications.map(notification => (
          <ListItem
            key={notification.id}
            secondaryAction={
              <IconButton edge="end" aria-label="dismiss" onClick={() => handleDismiss(notification.id)}>
                <CloseIcon />
              </IconButton>
            }
          >
            <ListItemText primary={notification.message} />
          </ListItem>
        ))}
      </List>
    </GenericCard>
  );
};

export default NotificationsCard;
