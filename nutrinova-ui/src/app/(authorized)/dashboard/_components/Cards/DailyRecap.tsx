'use client'
import React from 'react';
import GenericCard from './GenericCard';
import { LinearProgress, Box, Typography, Paper } from '@mui/material';

interface NutrientProgressProps {
  label: string;
  value: number;
  total: number;
  color: string; // Add a color prop for the total box
}

const NutrientProgress: React.FC<NutrientProgressProps> = ({ label, value, total, color }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
      <Paper
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '48px',
          height: '48px',
          color: 'white',
          textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
          backgroundColor: color,
          borderRadius: '8px',
          mr: 1,
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
          {total} g
        </Typography>
      </Paper>
      <Box sx={{ flex: 1, mr: 1 }}>
        <Typography variant="body2" sx={{ minWidth: '100px' }}>{label}</Typography>
        <LinearProgress variant="determinate" value={value} />
      </Box>
      <Typography variant="body2">{`${value}%`}</Typography>
    </Box>
  );
};

const DailyRecapCard: React.FC = () => {
  // These values would come from props or state in a real app
  const nutrients = [
    { label: 'Carbohydrate', value: 25, total: 54, color: '#4CAF50' }, // Add the total and color values
    { label: 'Fats', value: 35, total: 11.2, color: '#E91E63' },
    { label: 'Protein', value: 85, total: 16.2, color: '#2196F3' },
  ];

  return (
    <GenericCard title="Daily Recap">
      {nutrients.map((nutrient) => (
        <NutrientProgress
          key={nutrient.label}
          label={nutrient.label}
          value={nutrient.value}
          total={nutrient.total}
          color={nutrient.color}
        />
      ))}
    </GenericCard>
  );
};

export default DailyRecapCard;

