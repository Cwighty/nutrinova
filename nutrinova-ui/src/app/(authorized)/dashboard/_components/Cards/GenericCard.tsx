import React from 'react';
import { Card, CardContent, Typography, Box, useTheme, SxProps } from '@mui/material';
import { Theme } from '@mui/system';

interface GenericCardProps {
  title: string;
  icon?: React.ReactNode; // Optional icon prop
  children: React.ReactNode;
  sx?: SxProps<Theme>; // Allow custom styles
  actions?: React.ReactNode; // Add an actions prop
}

const GenericCard: React.FC<GenericCardProps> = ({ title, icon, children, sx, actions }) => {
  const theme = useTheme();

  return (
    <Card elevation={3} sx={{ borderRadius: theme.shape.borderRadius, ...sx }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {icon && <Box sx={{ display: 'flex', alignItems: 'center' }}>{icon}</Box>}
          <Typography variant="h6" component="div">
            {title}
          </Typography>
          {actions && <Box sx={{ ml: 'auto' }}>{actions}</Box>}
        </Box>
        <Box sx={{ mt: 2 }}>
          {children}
        </Box>
      </CardContent>
    </Card>
  );
};

export default GenericCard;
