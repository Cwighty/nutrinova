import { Typography, LinearProgress, Paper, List, ListItem, Box } from "@mui/material";
import { RecipeNutrientSummary } from "../_models/recipeNutrientSummary";
import { useRecipeSummaryQuery } from "../../recipeHooks";
import { CreateRecipeFoodModel } from "../_models/createRecipeFoodModel";

interface NutrientTotalsSummaryProps {
  recipeFoods: CreateRecipeFoodModel[];
}

export const NutrientTotalsSummary = ({
  recipeFoods,
}: NutrientTotalsSummaryProps) => {
  const {
    data: recipeNutrientSummary,
    isLoading: recipeNutrientSummaryIsLoading,
  } = useRecipeSummaryQuery(recipeFoods);

  return (
    <>
      <Paper elevation={6} sx={{ p: 2 }}>
        <Typography variant="h6">Nutrient Summary</Typography>
        {recipeNutrientSummaryIsLoading && <LinearProgress />}
        {recipeNutrientSummary && recipeNutrientSummary.length === 0 && (
          <Typography variant="caption">No foods added</Typography>
        )}
        <List dense>
          {recipeNutrientSummary &&
            recipeNutrientSummary.map((nutrient: RecipeNutrientSummary) => (
              <ListItem
                key={nutrient.name}
                sx={{ py: 0.5 }}
                divider
              >
                <Typography variant="body2">
                  {nutrient.name}
                </Typography>
                <Box sx={{ ml: "auto" }}>
                  <Typography
                    variant="body2"
                    sx={{ ml: "auto", fontWeight: "bold" }}
                  >
                    {nutrient.amount.toLocaleString(undefined, { maximumFractionDigits: 2 })} {nutrient.unit.abbreviation}
                  </Typography>
                </Box>
              </ListItem>
            ))}
        </List>
      </Paper>
    </>
  );
};
