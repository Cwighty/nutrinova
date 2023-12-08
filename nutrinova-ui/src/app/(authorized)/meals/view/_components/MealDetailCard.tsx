"use client";
import { format } from "date-fns";
import { Paper, Typography } from "@mui/material";
import { Meal } from "@/app/(authorized)/meals/view/_models/viewMeal";

interface MealDetailCardProps {
  meal: Meal;
}

export const MealDetailCard = ({ meal }: MealDetailCardProps) => {
  const description = meal.foodHistoryResponses[0]
    ? meal.foodHistoryResponses[0].description
    : meal.recipeHistoryResponses[0]
    ? meal.recipeHistoryResponses[0].description
    : "No description available";

  const mealTime = format(new Date(meal.recordedAt), "p");

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 1 }}>
        {description}
      </Typography>
      <Typography variant="body1" sx={{ mb: 1 }}>
        {mealTime}
      </Typography>
      <Typography variant="body2" sx={{ mb: 1 }}>
        Patient: {meal.patientResponse.firstname}{" "}
        {meal.patientResponse.lastname}
      </Typography>
      <Typography variant="body2">Notes: {meal.notes}</Typography>
    </Paper>
  );
};
