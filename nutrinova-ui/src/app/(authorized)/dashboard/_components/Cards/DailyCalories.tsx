import React from 'react';
import GenericCard from './GenericCard';
import { List, ListItem, ListItemText } from '@mui/material';

const DailyCaloriesCard: React.FC = () => {
  // This data would come from props or state in a real app
  const meals = [
    { name: 'Breakfast', calories: 240 },
    { name: 'Lunch', calories: 240 },
  ];

  return (
    <GenericCard title="Daily Calories">
      <List dense>
        {meals.map((meal, index) => (
          <ListItem key={index} divider>
            <ListItemText primary={meal.name} secondary={`${meal.calories} Kcal`} />
          </ListItem>
        ))}
        {/* Add more UI elements as needed */}
      </List>
    </GenericCard>
  );
};

export default DailyCaloriesCard;
