import { useGetRecipeByIdQuery } from "@/app/(authorized)/recipes/recipeHooks";
import { Card, CardContent, Typography } from "@mui/material";

interface MyRecipesDetailCardProps {
  recipeId: string;
}

export const MyRecipesDetailCard = ({ recipeId }: MyRecipesDetailCardProps) => {
  const { data: recipe } = useGetRecipeByIdQuery(recipeId);
  return (
    <Card sx={{ my: 1, p: 1.25 }}>
      <CardContent>
        <Typography variant={"h1"}>{recipe?.description}</Typography>
      </CardContent>
    </Card>
  );
};
