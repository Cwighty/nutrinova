"use client";
import { useGetRecipeByIdQuery } from "@/app/(authorized)/recipes/recipeHooks";
import {
  Typography,
  Chip,
  List,
  ListItem,
  ListItemText,
  Box,
  Alert,
  Skeleton,
  Paper,
  Divider,
} from "@mui/material";

interface MyRecipesDetailCardProps {
  recipeId: string;
}

export const MyRecipesDetailCard = ({ recipeId }: MyRecipesDetailCardProps) => {
  const { data: recipe, isLoading, isError } = useGetRecipeByIdQuery(recipeId);

  if (isError) {
    return <Alert severity="error">Error loading foods</Alert>;
  }

  if (isLoading) {
    return <Skeleton height={100} sx={{ m: 0 }} />;
  }

  if (recipe) {
    console.log(recipe);
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4">{recipe?.description}</Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
          my: 4,
        }}
      >
        {recipe?.tags
          .split(",")
          .map((tag, index) => <Chip key={index} label={tag} />)}
      </Box>
      <Typography variant={"h6"} sx={{ my: 2 }}>
        Ingredients
      </Typography>
      <Divider />
      <List>
        {recipe?.recipeFoods.map((recipeFood, index) => (
          <ListItem key={index}>
            <ListItemText primary={recipeFood.food.description} />
          </ListItem>
        ))}
      </List>
      <Typography variant={"h6"} gutterBottom>
        Notes
      </Typography>
      <Divider />
      <Typography variant="body1" sx={{ mt: 2, ml: 2 }}>
        {recipe?.notes}
      </Typography>
    </Paper>
  );
};