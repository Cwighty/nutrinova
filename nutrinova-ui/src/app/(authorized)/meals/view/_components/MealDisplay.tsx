"use client";
import {
  Box,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { Meal } from "@/app/(authorized)/meals/view/_models/viewMeal";
import { format } from "date-fns";
import { NextLinkComposed } from "@/components/Link";

interface MealDisplayProps {
  meal: Meal;
}

export const MealDisplay = ({ meal }: MealDisplayProps) => {
  const primaryText = (
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <Typography variant="h6">{meal.description}</Typography>
      <Typography variant="h6">
        {meal.amount} {meal.unit.description}
      </Typography>
    </Box>
  );

  const secondaryText = (
    <Box>
      <Typography variant="h6">
        {format(new Date(meal.recordedAt), "p")}
      </Typography>
    </Box>
  );

  return (
    <ListItem disableGutters disablePadding>
      <ListItemButton
        component={NextLinkComposed}
        to={{
          pathname: "/meals/view/details",
          query: { mealId: meal.id },
        }}
      >
        <ListItemText primary={primaryText} secondary={secondaryText} />
      </ListItemButton>
    </ListItem>
  );
};
