import {
  List,
  Box,
  Alert,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from "@mui/material";
import { AddFoodDialog } from "./AddFood/AddFoodDialog";
import { CreateRecipeRequestModel } from "../_models/createRecipeRequest";
import { useState } from "react";
import { CreateRecipeFoodModel, FoodConversionSample } from "../_models/createRecipeFoodModel";
import { Delete } from "@mui/icons-material";
import { useCreateFoodConversionSampleMutation } from "../../foodConversionSampleHooks";

interface RecipeFoodListProps {
  recipeFormState: CreateRecipeRequestModel;
  setRecipeFormState: (recipeForm: CreateRecipeRequestModel) => void;
}

const initialFood: CreateRecipeFoodModel = {
  foodId: "",
  measurement: 1,
  measurementUnitId: 1,
  name: "",
  measurementUnitName: "Gram",
  foodServingsPerMeasurement: null,
};

export const RecipeFoodList = ({
  recipeFormState,
  setRecipeFormState,
}: RecipeFoodListProps) => {
  const [newFood, setNewFood] = useState<CreateRecipeFoodModel>({
    ...initialFood,
  });

  const createFoodConversionSampleMutation = useCreateFoodConversionSampleMutation();

  const handleAddFood = () => {
    const foodConversionSample: FoodConversionSample = {
      foodPlanId: newFood.foodId,
      foodServingsPerMeasurement: newFood.foodServingsPerMeasurement,
      measurementUnitId: newFood.measurementUnitId,
    };
    if (foodConversionSample.foodServingsPerMeasurement !== null) {
      createFoodConversionSampleMutation.mutate(foodConversionSample,
        {
          onSuccess: () => {
            // ensure theres a food conversion sample in place before rerendering the nutrition summary
            setRecipeFormState({
              ...recipeFormState,
              recipeFoods: [...recipeFormState.recipeFoods, newFood],
            });
          }
        }
      );
    }
    else {
      setRecipeFormState({
        ...recipeFormState,
        recipeFoods: [...recipeFormState.recipeFoods, newFood],
      });
    }
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
            secondary={`${food.measurement} ${food.measurementUnitName}`}
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
