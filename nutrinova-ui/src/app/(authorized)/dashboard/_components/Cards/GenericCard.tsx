'use client'
import React from 'react';
import { Card, CardContent, Typography, Box, useTheme } from '@mui/material';

interface GenericCardProps {
  title: string;
  children: React.ReactNode;
}

const GenericCard: React.FC<GenericCardProps> = ({ title, children }) => {
  const theme = useTheme();

  return (
    <Card elevation={3} sx={{ borderRadius: theme.shape.borderRadius }}>
      <CardContent>
        <Typography variant="h6" component="div">
          {title}
        </Typography>
        <Box sx={{ mt: 2 }}>
          {children}
        </Box>
      </CardContent>
    </Card>
  );
};

export default GenericCard;
