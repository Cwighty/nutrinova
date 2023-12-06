"use client";
import { ListItem, ListItemButton, ListItemText } from "@mui/material";
import { Meal } from "@/app/(authorized)/meals/view/_models/viewMeal";
import { format } from "date-fns";

interface MealDisplayProps {
  meal: Meal;
}

export const MealDisplay = ({ meal }: MealDisplayProps) => {
  const description = meal.foodHistoryResponses[0]
    ? meal.foodHistoryResponses[0].description
    : meal.recipeHistoryResponses[0]
      ? meal.recipeHistoryResponses[0].description
      : "No description available";

  const mealTime = format(new Date(meal.recordedAt), "p");

  return (
    <ListItem disableGutters disablePadding>
      <ListItemButton>
        <ListItemText primary={description} secondary={mealTime} />
      </ListItemButton>
    </ListItem>
  );
};
