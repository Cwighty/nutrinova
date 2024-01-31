import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import React from "react";
import {
  ImportFoodResponse,
  useGetFoodSearchResultQuery,
  useImportFoodMutation,
} from "@/app/(authorized)/food/foodHooks";
import { useRouter } from "next/navigation";
import { FoodSearchDetailSkeleton } from "@/components/skeletons/FoodSearchDetailSkeleton";
import { FoodSearchFilterParams } from "@/app/(authorized)/food/_models/foodSearchFilterParams";
import CenteredSpinnerWithBackdrop from "@/components/CenteredSpinnerOverlay";

interface SearchFoodsDetailCardProps {
  searchFilterParams: FoodSearchFilterParams;
  fdcIdParam: string | string[] | undefined;
}

export const SearchFoodsDetailCard = ({
  searchFilterParams,
  fdcIdParam,
}: SearchFoodsDetailCardProps) => {
  const fdcId = parseInt(fdcIdParam as string);
  const { data: food, isLoading: foodIsLoading } = useGetFoodSearchResultQuery(
    searchFilterParams,
    fdcId,
  );

  const importFoodMutation = useImportFoodMutation();
  const router = useRouter();

  const handleImport = () => {
    importFoodMutation.mutate(food!.fdcId, {
      onSuccess: (response: ImportFoodResponse) => {
        router.push("/food/edit?foodId=" + response.id);
      },
    });
  };

  if (!food || foodIsLoading) {
    return <FoodSearchDetailSkeleton />;
  }
  return (
    <Card sx={{ my: 1, p: 1.25 }}>
      {importFoodMutation.isPending && (
        <CenteredSpinnerWithBackdrop message="Importing food..." />
      )}
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="start">
          <Box>
            <Typography variant="h5" gutterBottom>
              {food.description}
            </Typography>
            {food.brandName && (
              <Typography variant="h6" color="primary" gutterBottom>
                {food.brandName}
              </Typography>
            )}
          </Box>
          <Button variant="contained" color="primary" onClick={handleImport}>
            Import
          </Button>
        </Box>
        {food.ingredients && (
          <Box
            sx={{
              mt: 1.25,
            }}
          >
            {food.ingredients.split(",").map((ingredient, index) => (
              <Chip
                label={ingredient.trim()}
                variant="outlined"
                size="small"
                sx={{
                  m: 0.5,
                  maxWidth: { xs: 250, sm: "none" },
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                key={index}
              />
            ))}
          </Box>
        )}
        {food.servingSizeWithUnits && (
          <Typography variant="body1" paragraph sx={{ my: 1.5 }}>
            Serving Size: {food.servingSizeWithUnits}
          </Typography>
        )}
        {food.foodNutrients && food.foodNutrients.length > 0 && (
          <>
            <Typography variant="h6" gutterBottom sx={{ mt: 1 }}>
              Nutrients
            </Typography>
            <List>
              {food.foodNutrients.map((nutrient) => (
                <ListItem
                  key={nutrient.nameWithAmountAndUnit}
                  sx={{ py: 0.5 }}
                  divider
                >
                  <Typography variant="body2">
                    {nutrient.nutrientName}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ ml: "auto", fontWeight: "bold" }}
                  >
                    {nutrient.value} {nutrient.unitName}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </>
        )}
      </CardContent>
    </Card>
  );
};
