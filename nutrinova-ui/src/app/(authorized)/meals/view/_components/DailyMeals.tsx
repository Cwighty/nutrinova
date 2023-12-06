"use client";
import { useState } from "react";
import { addDays, endOfDay, format, getHours, startOfDay } from "date-fns";
import { Meal } from "@/app/(authorized)/meals/view/_models/viewMeal";
import { Alert, Box, Button, Skeleton, Typography } from "@mui/material";
import { MealDisplay } from "@/app/(authorized)/meals/view/_components/MealDisplay";
import { useGetMealHistoryQuery } from "@/app/(authorized)/meals/mealHooks";

export const DailyMeals = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleDateChange = (days: number) => {
    setCurrentDate(addDays(currentDate, days));
  };

  const {
    data: meals,
    isLoading,
    isError,
  } = useGetMealHistoryQuery(startOfDay(currentDate), endOfDay(currentDate));

  const categorizeMeals = (meals: Meal[]): Record<string, Meal[]> => {
    const categories: { morning: Meal[]; afternoon: Meal[]; evening: Meal[] } =
      { morning: [], afternoon: [], evening: [] };

    meals.forEach((meal) => {
      const hour = getHours(meal.recordedAt);
      if (hour < 12) {
        categories.morning.push(meal);
      } else if (hour < 18) {
        categories.afternoon.push(meal);
      } else {
        categories.evening.push(meal);
      }
    });

    return categories;
  };

  const categorizedMeals = categorizeMeals(meals || []);

  if (isLoading) {
    return <Skeleton variant="rectangular" height={200} />;
  }
  if (isError) {
    return <Alert severity="error">Error loading meals</Alert>;
  }

  return (
    <>
      <Typography variant="h6">{format(currentDate, "PPP")}</Typography>
      <Button onClick={() => handleDateChange(-1)}>Previous Day</Button>
      <Button onClick={() => handleDateChange(1)}>Next Day</Button>

      {Object.entries(categorizedMeals).map(([timeOfDay, meals]) => (
        <Box key={timeOfDay}>
          {meals.map((meal) => (
            <MealDisplay key={meal.id} meal={meal} timeOfDay={timeOfDay} />
          ))}
        </Box>
      ))}
    </>
  );
};
