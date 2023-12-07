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
  Stack,
  Grid,
  ListItemButton,
  Divider,
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
            <Divider />
            <List disablePadding>
              {recipe?.recipeFoods.map((food, index) => (
                <Box key={index}>
                  <ListItem key={index} disableGutters disablePadding>
                    <ListItemButton
                      component={NextLinkComposed}
                      to={{
                        pathname: "/food/view/details",
                        query: { foodId: food.id },
                      }}
                    >
                      <ListItemText
                        primary={`${food.description}: ${food.servingSize} ${food.servingSizeUnit}`}
                      />
                    </ListItemButton>
                  </ListItem>
                  <Divider />
                </Box>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={6} sx={{ p: 2 }}>
            <Typography variant={"h6"} sx={{ mb: 2 }}>
              Tags
            </Typography>
            {recipe?.tags === "" ? (
              <Typography variant="body1">No tags</Typography>
            ) : (
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
            )}
          </Paper>
        </Grid>
      </Grid>
      <Paper elevation={6} sx={{ p: 2, my: 2 }}>
        <Typography variant={"h6"} sx={{ mb: 2 }}>
          Notes
        </Typography>
        {recipe?.notes ? (
          <Typography variant="body2" sx={{ mt: 1 }}>
            {recipe?.notes}
          </Typography>
        ) : (
          <Typography variant="body2" sx={{ mt: 1 }}>
            <em>None</em>
          </Typography>
        )}
      </Paper>
      <Paper elevation={6} sx={{ p: 2, my: 2 }}>
        {recipe?.nutrientSummaries && recipe?.nutrientSummaries.length > 0 && (
          <>
            <Typography variant="h6" gutterBottom sx={{ mt: 1 }}>
              Nutrient Summary
            </Typography>
            <List dense>
              {recipe?.nutrientSummaries.map((nutrient) => (
                <ListItem key={nutrient.name} sx={{ py: 0.5 }} divider>
                  <Typography variant="body2">{nutrient.name}</Typography>
                  <Typography
                    variant="body2"
                    sx={{ ml: "auto", fontWeight: "bold" }}
                  >
                    {nutrient.amount.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}{" "}
                    {nutrient.unit.abbreviation}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </>
        )}
      </Paper>
    </Paper>
  );
};
