
import { Add } from "@mui/icons-material";
import { Box, IconButton, ListItem, ListItemButton, Typography } from "@mui/material";
import { MealSelectionItem } from "../../_models/mealSelectionItem";

interface PrepMealCardProps {
  mealSelectionItem: MealSelectionItem;
  calories: number;
  onDetailClick: (selectedFood : MealSelectionItem) => void;
  onAddClick: (selectedFood : MealSelectionItem) => void;
}

export const PrepMealCard: React.FC<PrepMealCardProps> = ({ mealSelectionItem, calories, onDetailClick, onAddClick }: PrepMealCardProps) => {
  return (
    <ListItem sx={{ display: "flex", justifyContent: "space-between" }}>
      <ListItemButton onClick={() => onDetailClick(mealSelectionItem)}>
        <Box>
          <Typography>{mealSelectionItem.description}</Typography>
          <Typography>{mealSelectionItem.servingSize} {mealSelectionItem.servingSizeUnit?.abbreviation} | {calories} kcal</Typography>
        </Box>
      </ListItemButton>
      <Box>
        <IconButton onClick={() => onAddClick(mealSelectionItem)}><Add /></IconButton>
      </Box>
    </ListItem>
  )
};