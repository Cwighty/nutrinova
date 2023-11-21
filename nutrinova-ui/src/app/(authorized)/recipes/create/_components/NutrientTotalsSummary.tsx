import { Typography, LinearProgress } from "@mui/material";
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
      <Typography variant="h6">Nutrient Totals</Typography>
      {recipeNutrientSummaryIsLoading && <LinearProgress />}
      {recipeNutrientSummary && recipeNutrientSummary.length === 0 && (
        <Typography variant="caption">No foods added</Typography>
      )}
      {recipeNutrientSummary &&
        recipeNutrientSummary.map((nutrient: RecipeNutrientSummary) => (
          <Typography key={nutrient.name} variant="subtitle1">
            {nutrient.name}: {nutrient.amount} {nutrient.unit.abbreviation}
          </Typography>
        ))}
    </>
  );
};
