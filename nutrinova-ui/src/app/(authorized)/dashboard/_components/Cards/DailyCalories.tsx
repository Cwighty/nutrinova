'use client'
import React, { useState } from 'react';
import GenericCard from './GenericCard';
import { List, ListItem, ListItemText, Box, Typography, IconButton, LinearProgress } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AddIcon from '@mui/icons-material/Add';
import RecordMealModal from '@/app/(authorized)/meals/record/_components/SimpleAdd/RecordMealModal';
import { useGetTodaysMealsQuery } from '@/app/(authorized)/meals/mealHooks';
import { Meal } from '@/app/(authorized)/meals/view/_models/viewMeal';
import { AtomSpinner } from '@/components/atom-spinner/AtomSpinner';
import { useRouter } from 'next/navigation';

// Define the interface for meal items
interface MealItem {
  name: string;
  amount: number;
  unit: string;
}

// Interface for the meal with a period of the day and an array of meal items
interface FormattedMeal {
  period: 'Morning' | 'Afternoon' | 'Evening';
  items: MealItem[];
}

const DailyCaloriesCard: React.FC = () => {
  const router = useRouter();

  const [isRecordedMealModalOpen, setIsRecordedMealModalOpen] = useState(false);

  const { data: mealData, isLoading: isMealDataLoading } = useGetTodaysMealsQuery();

  const getMealPeriod = (time: Date) => {
    const hour = time.getHours();
    if (hour < 12) {
      return 'Morning';
    } else if (hour < 18) {
      return 'Afternoon';
    } else {
      return 'Evening';
    }
  };

  const formatMealItems = (meals: Meal[]) => {
    return meals.map(meal => ({
      name: meal.description,
      amount: Math.round(meal.nutrientSummaries.find(nutrient => nutrient.name.includes("Energy"))?.amount ?? 0),
      unit: 'kcal'
    }));
  }

  const meals: FormattedMeal[] = [
    { period: 'Morning', items: formatMealItems(mealData?.filter(meal => getMealPeriod(new Date(meal.recordedAt)) === 'Morning') ?? []) },
    { period: 'Afternoon', items: formatMealItems(mealData?.filter(meal => getMealPeriod(new Date(meal.recordedAt)) === 'Afternoon') ?? []) },
    { period: 'Evening', items: formatMealItems(mealData?.filter(meal => getMealPeriod(new Date(meal.recordedAt)) === 'Evening') ?? []) },
  ];

  // This would also be dynamic, calculated based on total calories - consumed calories
  const remainingCalories = 2000;

  const renderMealItems = (items: MealItem[]) => {
    const visibleItems = items.slice(0, 4);
    const additionalItemsCount = items.length - visibleItems.length;

    return (
      <>
        {items.length === 0 && <Typography variant="body2">No items recorded</Typography>}
        {visibleItems.map((item, index) => (
          <Box key={index} display={'flex'} justifyContent={'space-between'}>
            <Typography
              variant="body2"
              sx={{
                width: '70%',
                display: 'block',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {item.name}
            </Typography>
            <Typography variant="body2">
              {item.amount} {item.unit}
            </Typography>
          </Box>
        ))}
        {additionalItemsCount > 0 && (
          <Typography variant="body2" sx={{ display: 'block' }}>
            {additionalItemsCount} more items...
          </Typography>
        )}
      </>
    );
  };


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

  const handleClose = () => {
    setIsRecordedMealModalOpen(false);
  }


  const totalCalories = meals.reduce((acc, meal) => acc + meal.items.reduce((acc, item) => acc + item.amount, 0), 0);

  return (
    <GenericCard title="Eaten Today" >
      {isMealDataLoading && <AtomSpinner />}
      {!isMealDataLoading && meals.length === 0 && <Typography variant="body2">No meals recorded today</Typography>}
      {!isMealDataLoading && meals.length > 0 && (
        <>
          <List dense>
            {meals.map((meal, index) => (
              <ListItem key={index} sx={{ mb: 2, borderRadius: '16px', bgcolor: getBackgroundColor(index) }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                  <ListItemText
                    primary={meal.period}
                    secondary={renderMealItems(meal.items)}
                    primaryTypographyProps={{ fontWeight: 'medium' }}
                  />
                  <IconButton edge="end" size="small" onClick={() => router.push("/meals/view")}>
                    <ArrowForwardIosIcon fontSize="small" />
                  </IconButton>
                </Box>
              </ListItem>
            ))}
          </List>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <Typography variant="body2" sx={{ flexGrow: 1, mr: 1 }}>
              Total Calories
            </Typography>
            <LinearProgress
              variant="determinate"
              value={(totalCalories / (remainingCalories)) * 100}
              sx={{ flexGrow: 2, mr: 1 }}
            />
            <Typography variant="body2">
              {totalCalories} Kcal
            </Typography>
            <IconButton color="primary" sx={{ ml: 1 }} onClick={() => setIsRecordedMealModalOpen(true)}>
              <AddIcon />
            </IconButton>
          </Box>
          <RecordMealModal open={isRecordedMealModalOpen} handleClose={handleClose} />
        </>
      )}
    </GenericCard >
  );
};

export default DailyCaloriesCard;
