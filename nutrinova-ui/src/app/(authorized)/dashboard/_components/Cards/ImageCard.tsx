'use client'
import React from 'react';
import { Card, CardContent, Typography, Box, CircularProgress, useTheme } from '@mui/material';
import { SxProps, Theme } from '@mui/system';

interface ImageCardProps {
  title: string;
  subtitle: string;
  progress: number;
  backgroundImage: string;
  sx?: SxProps<Theme>;
}

const ImageCard: React.FC<ImageCardProps> = ({ title, subtitle, progress, backgroundImage, sx }) => {
  const theme = useTheme();
  return (
    <Card sx={{
      alignItems: 'center',
      justifyContent: 'space-between',
      p: 2,
      borderRadius: theme.shape.borderRadius,
      color: 'white',
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      ...sx
    }}>
      <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
        <Typography variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="subtitle1" component="div">
          {subtitle}
        </Typography>
      </CardContent>
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress variant="determinate" value={progress} size={48} thickness={4} />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'primary.main',
          }}
        >
          <Typography variant="caption" component="div" color="textPrimary">{`${Math.round(progress)}%`}</Typography>
        </Box>
      </Box>
    </Card>
  );
};

export default ImageCard;
