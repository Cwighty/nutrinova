'use client'
import React from 'react';
import { Card, Typography, CardMedia, CardContent, Box, useTheme } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

interface CareReminderCardProps {
  title: string;
  time: string;
  description: string;
  image: string; // Image URL
}

const ReminderCard: React.FC<CareReminderCardProps> = ({ title, time, description, image }) => {
  const theme = useTheme();
  return (
    <Card sx={{ maxWidth: 345, position: 'relative', borderRadius: theme.shape.borderRadius }}>
      <CardMedia
        component="img"
        height="160"
        image={image}
        alt={title}
      />
      <CardContent sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
        backdropFilter: 'blur(4px)', // Acrylic glass blur effect
        WebkitBackdropFilter: 'blur(4px)', // Safari support for backdrop filter
        color: 'white',
      }}>
        <Typography variant="h5" sx={{ my: 1 }} >
          {title}
        </Typography>
        <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
          <AccessTimeIcon sx={{ marginRight: 1 }} />
          <Typography variant="body2">{time}</Typography>
        </Box>
        <Typography variant="body2">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ReminderCard;