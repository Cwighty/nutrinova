"use client";
import { useRef, useState } from "react";
import { addDays, endOfDay, format, getHours, startOfDay } from "date-fns";
import { Meal } from "@/app/(authorized)/meals/view/_models/viewMeal";
import {
  Alert,
  Box,
  Button,
  IconButton,
  List,
  Paper,
  Slide,
  Typography,
} from "@mui/material";
import { MealDisplay } from "@/app/(authorized)/meals/view/_components/MealDisplay";
import { useGetMealHistoryQuery } from "@/app/(authorized)/meals/mealHooks";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

export const DailyMeals = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [slideIn, setSlideIn] = useState(true);
  const [slideDirection, setSlideDirection] = useState<"left" | "right">(
    "left",
  );
  const [openDatePicker, setOpenDatePicker] = useState(false);

  const containerRef = useRef<HTMLElement>(null);

  const handleIncrementalDateChange = (days: number) => {
    setSlideDirection(days > 0 ? "right" : "left");
    setSlideIn(false);
    setTimeout(() => {
      setCurrentDate(addDays(currentDate, days));
      setSlideDirection(days > 0 ? "left" : "right");
      setSlideIn(true);
    }, 500);
  };

  const handleDateChange = (newDate: Date | null) => {
    if (newDate) {
      setCurrentDate(newDate);
    }
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
      <Box
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <IconButton
          onClick={() => handleIncrementalDateChange(-1)}
          size="large"
        >
          <ChevronLeft />
        </IconButton>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            open={openDatePicker}
            value={currentDate}
            onChange={(newValue) => {
              handleDateChange(newValue);
              setOpenDatePicker(false);
            }}
            onClose={() => setOpenDatePicker(false)}
            slotProps={{
              textField: { sx: { opacity: 0, maxWidth: 0, maxHeight: 0 } },
            }}
          />
        </LocalizationProvider>
        <Button
          onClick={() => setOpenDatePicker(true)}
          sx={{ fontSize: { xs: "1rem", md: "1.5rem" } }}
        >
          {format(currentDate, "PPP")}
        </Button>
        <IconButton onClick={() => handleIncrementalDateChange(1)} size="large">
          <ChevronRight />
        </IconButton>
      </Box>

      <Slide
        in={slideIn}
        direction={slideDirection}
        container={containerRef.current}
      >
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
