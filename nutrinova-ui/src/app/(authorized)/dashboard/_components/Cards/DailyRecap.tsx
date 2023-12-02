import React from 'react';
import GenericCard from './GenericCard';
import { LinearProgress, Box, Typography } from '@mui/material';

interface NutrientProgressProps {
  label: string;
  value: number;
}

const NutrientProgress: React.FC<NutrientProgressProps> = ({ label, value }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
      <Typography variant="body2" sx={{ minWidth: '100px' }}>{label}</Typography>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" value={value} />
      </Box>
      <Typography variant="body2">{`${value}%`}</Typography>
    </Box>
  );
};

const DailyRecapCard: React.FC = () => {
  // These values would come from props or state in a real app
  const nutrients = [
    { label: 'Carbohydrate', value: 25 },
    { label: 'Protein', value: 25 },
    { label: 'Fats', value: 25 },
  ];

  return (
    <GenericCard title="Daily Recap">
      {nutrients.map((nutrient) => (
        <NutrientProgress key={nutrient.label} label={nutrient.label} value={nutrient.value} />
      ))}
    </GenericCard>
  );
};

export default DailyRecapCard;
