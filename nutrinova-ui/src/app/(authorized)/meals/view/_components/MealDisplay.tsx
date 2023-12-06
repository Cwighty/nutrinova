"use client";
import { Paper, Typography } from "@mui/material";
import { Meal } from "@/app/(authorized)/meals/view/_models/viewMeal";
import { format } from "date-fns";

interface MealDisplayProps {
  meal: Meal;
  timeOfDay: string;
}

export const MealDisplay = ({ meal, timeOfDay }: MealDisplayProps) => {
  const description = meal.mealFoods
    ? meal.mealFoods[0].description
    : meal.mealRecipes
    ? meal.mealRecipes[0].description
    : "No description available";

  const mealTime = format(new Date(meal.recordedAt), "p");

  return (
    <Paper style={{ padding: "16px", margin: "8px 0" }}>
      <Typography variant="subtitle1">{timeOfDay}</Typography>
      <Typography variant="body1">{description}</Typography>
      <Typography variant="body2">{mealTime}</Typography>
    </Paper>
  );
};
