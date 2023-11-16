import {
  List,
  Box,
  Alert,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from "@mui/material";
import { AddFoodDialog } from "./AddFoodDialog";
import { CreateRecipeRequestModel } from "../_models/createRecipeRequest";
import { useState } from "react";
import { CreateRecipeFoodModel } from "../_models/createRecipeFoodModel";
import { Delete } from "@mui/icons-material";

interface RecipeFoodListProps {
  recipeFormState: CreateRecipeRequestModel;
  setRecipeFormState: (recipeForm: CreateRecipeRequestModel) => void;
}

const initialFood: CreateRecipeFoodModel = {
  foodId: "",
  amount: 1,
  unitId: 1,
  name: "",
  unitName: "Gram",
};

export const RecipeFoodList = ({
  recipeFormState,
  setRecipeFormState,
}: RecipeFoodListProps) => {
  const [newFood, setNewFood] = useState<CreateRecipeFoodModel>({
    ...initialFood,
  });

  const handleAddFood = () => {
    setRecipeFormState({
      ...recipeFormState,
      recipeFoods: [...recipeFormState.recipeFoods, newFood],
    });
    setNewFood({ ...initialFood });
  };

  const handleRemoveFood = (index: number) => {
    const updatedFoods = [...recipeFormState.recipeFoods];
    updatedFoods.splice(index, 1);
    setRecipeFormState({ ...recipeFormState, recipeFoods: updatedFoods });
  };

  return (
    <List>
      <Box>
        <AddFoodDialog
          newFood={newFood}
          setNewFood={setNewFood}
          handleAddFood={handleAddFood}
        />
      </Box>
      {recipeFormState.recipeFoods.length === 0 && (
        <Alert severity="warning">Please add at least one food</Alert>
      )}
      {recipeFormState.recipeFoods.map((food, index) => (
        <ListItem key={index} divider>
          <ListItemText
            primary={food.name}
            secondary={`${food.amount} ${food.unitName}`}
          />
          <ListItemSecondaryAction>
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={() => handleRemoveFood(index)}
            >
              <Delete />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
};
