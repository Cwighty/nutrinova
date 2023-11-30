"use client";
import { useGetRecipeByIdQuery } from "@/app/(authorized)/recipes/recipeHooks";
import {
  Typography,
  Chip,
  List,
  Button,
  ListItem,
  ListItemText,
  Box,
  Alert,
  Skeleton,
  Paper,
  Divider,
  Stack,
  Grid,
  ListItemButton,
} from "@mui/material";
interface MyRecipesDetailCardProps {
  recipeId: string;
}
import { useRouter } from "next/navigation";
import { NextLinkComposed } from "@/components/Link";

export const MyRecipesDetailCard = ({ recipeId }: MyRecipesDetailCardProps) => {
  const router = useRouter();
  const { data: recipe, isLoading, isError } = useGetRecipeByIdQuery(recipeId);

  if (isError) {
    return <Alert severity="error">Error loading recipe</Alert>;
  }

  if (isLoading) {
    return <Skeleton height={100} sx={{ m: 0 }} />;
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        justifyContent="space-between"
      >
        <Typography variant="h4">{recipe?.description}</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push("/recipes/edit?recipeId=" + recipeId)}
        >
          Edit
        </Button>
      </Stack>
      <Typography variant="subtitle1" sx={{ my: 2 }}>
        Serving Size: {recipe?.amount} {recipe?.unit.description}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper elevation={6} sx={{ p: 2 }}>
            <Typography variant={"h6"} sx={{ mb: 2 }}>
              Ingredients
            </Typography>
            <List disablePadding>
              {recipe?.recipeFoods.map((food, index) => (
                <ListItem key={index} disableGutters disablePadding>
                  <ListItemButton
                    key="Dashboard"
                    component={NextLinkComposed}
                    to={{
                      pathname: "/food/view/details",
                      query: { foodId: food.id },
                    }}
                  >
                    <ListItemText primary={food.description} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={6} sx={{ p: 2 }}>
            <Typography variant={"h6"} sx={{ mb: 2 }}>
              Tags
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
                mt: 2,
              }}
            >
              {recipe?.tags
                .split(",")
                .map((tag, index) => (
                  <Chip key={index} label={tag} sx={{ boxShadow: 2 }} />
                ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
      <Paper elevation={6} sx={{ p: 2, my: 2 }}>
        <Typography variant={"h6"} sx={{ mb: 2 }}>
          Notes
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          {recipe?.notes}
        </Typography>
      </Paper>
    </Paper>
  );
};
