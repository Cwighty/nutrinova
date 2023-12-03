'use client'
import React, { useEffect, useState } from 'react';
import GenericCard from './GenericCard';
import { List, ListItem, ListItemText, Box, Typography, IconButton, LinearProgress } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/navigation';

// Define the interface for meal items
interface MealItem {
  name: string;
  calories: number;
}

// Interface for the meal with a period of the day and an array of meal items
interface Meal {
  period: 'Morning' | 'Afternoon' | 'Evening';
  items: MealItem[];
}

const DailyCaloriesCard: React.FC = () => {
  const router = useRouter();
  const [meals, setClientMeals] = useState<Meal[]>([]);
  // This data would come from props or state in a real app
  useEffect(() => {
    const fetchMeals = () => {
      // Fetch meals from an API or other asynchronous source
      const meals: Meal[] = [
        { period: 'Morning', items: [{ name: 'Oatmeal', calories: 150 }, { name: 'Orange Juice', calories: 90 }] },
        { period: 'Afternoon', items: [{ name: 'Salad', calories: 240 }] },
        { period: 'Evening', items: [{ name: 'Grilled Chicken', calories: 350 }, { name: 'Rice', calories: 200 }] },
      ];
      setClientMeals(meals);
    };

    fetchMeals();
  }, []);

  // This would also be dynamic, calculated based on total calories - consumed calories
  const remainingCalories = 635;

  const renderMealItems = (items: MealItem[]) => items.map((item, index) => (
    <Typography key={index} variant="body2" sx={{ display: 'block' }}>
      {item.name} - {item.calories} Kcal
    </Typography>
  ));


  const getBackgroundColor = (index: number) => {
    const colors = [
      '#2196F3', // Blue
      '#4CAF50', // Green
      '#FF9800', // Orange
      '#E91E63', // Pink
      '#3F51B5', // Indigo
      '#009688', // Teal
      '#9C27B0', // Purple
      '#F44336', // Red
      '#673AB7', // Deep Purple
      '#00BCD4', // Cyan
      '#FFEB3B', // Yellow
      '#FFC107', // Amber
      '#FF5722', // Deep Orange
      '#607D8B', // Blue Grey
      '#795548', // Brown
    ];

    const colorIndex = index % colors.length;
    return colors[colorIndex];
  };

  return (
    <GenericCard title="Daily Calories">
      <List dense>
        {meals.map((meal, index) => (
          <ListItem key={index} sx={{ mb: 2, borderRadius: '16px', bgcolor: getBackgroundColor(index) }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <ListItemText
                primary={meal.period}
                secondary={renderMealItems(meal.items)}
                primaryTypographyProps={{ fontWeight: 'medium' }}
              />
              <IconButton edge="end" size="small">
                <ArrowForwardIosIcon fontSize="small" />
              </IconButton>
            </Box>
          </ListItem>
        ))}
      </List>
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
        <Typography variant="body2" sx={{ flexGrow: 1, mr: 1 }}>
          Remaining
        </Typography>
        <LinearProgress
          variant="determinate"
          value={(remainingCalories / (remainingCalories + meals.reduce((acc, meal) => acc + meal.items.reduce((acc, item) => acc + item.calories, 0), 0))) * 100}
          sx={{ flexGrow: 2, mr: 1 }}
        />
        <Typography variant="body2">
          {remainingCalories} Kcal
        </Typography>
        <IconButton color="primary" sx={{ ml: 1 }} onClick={() => router.push("/meals/record")}>
          <AddIcon />
        </IconButton>
      </Box>
    </GenericCard >
  );
};

export default DailyCaloriesCard;

