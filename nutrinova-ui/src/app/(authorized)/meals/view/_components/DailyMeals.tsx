"use client";
import { useRef, useState } from "react";
import { addDays, endOfDay, format, getHours, startOfDay } from "date-fns";
import { Meal } from "@/app/(authorized)/meals/view/_models/viewMeal";
import {
  Alert,
  Box,
  Button,
  List,
  Paper,
  Slide,
  Typography,
} from "@mui/material";
import { MealDisplay } from "@/app/(authorized)/meals/view/_components/MealDisplay";
import { useGetMealHistoryQuery } from "@/app/(authorized)/meals/mealHooks";

export const DailyMeals = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [slideIn, setSlideIn] = useState(true);

  const containerRef = useRef<HTMLElement>(null);

  const handleDateChange = (days: number) => {
    setSlideIn(false);
    setTimeout(() => {
      setCurrentDate(addDays(currentDate, days));
      setSlideIn(true);
    }, 200);
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
      const hour = getHours(new Date(meal.recordedAt));
      console.log(hour);
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

  if (isError) {
    return <Alert severity="error">Error loading meals</Alert>;
  }

  return (
    <Box sx={{ px: 1, overflow: "hidden" }} ref={containerRef}>
      <Typography variant="h6">{format(currentDate, "PPP")}</Typography>
      <Button onClick={() => handleDateChange(-1)}>Previous Day</Button>
      <Button onClick={() => handleDateChange(1)}>Next Day</Button>

      <Slide in={slideIn} direction={"left"} container={containerRef.current}>
        {isLoading ? (
          <Box />
        ) : (
          <Box>
            {Object.entries(categorizedMeals).map(([timeOfDay, meals]) => {
              if (meals.length > 0) {
                return (
                  <Box key={timeOfDay}>
                    <Typography variant="h6">
                      {timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)}
                    </Typography>
                    <Paper elevation={3} sx={{ mb: 2 }}>
                      <List disablePadding>
                        {meals.map((meal) => (
                          <MealDisplay key={meal.id} meal={meal} />
                        ))}
                      </List>
                    </Paper>
                  </Box>
                );
              }
              return null;
            })}
          </Box>
        )}
      </Slide>
    </Box>
  );
};
