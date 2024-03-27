
import { Add } from "@mui/icons-material";
import { Box, IconButton, ListItem, ListItemButton, Typography } from "@mui/material";
import { PrepMealItem } from "../../_models/preMealItem";

interface PrepMealCardProps {
  mealSelectionItem: PrepMealItem;
  onDetailClick: (selectedFood: PrepMealItem) => void;
  onAddClick: (selectedFood: PrepMealItem) => void;
}

export const PrepMealCard: React.FC<PrepMealCardProps> = ({ mealSelectionItem, onDetailClick, onAddClick }: PrepMealCardProps) => {
  return (
    <ListItem sx={{ display: "flex", justifyContent: "space-between" }}>
      <ListItemButton onClick={() => onDetailClick(mealSelectionItem)}>
        <Box>
          <Typography>{mealSelectionItem.description}</Typography>
          <Typography>{mealSelectionItem.servingSize} {mealSelectionItem.servingSizeUnit} | {Math.round(mealSelectionItem.calories)} kcal</Typography>
        </Box>
      </ListItemButton>
      <Box>
        <IconButton onClick={() => onAddClick(mealSelectionItem)}><Add /></IconButton>
      </Box>
    </ListItem>
  )
};