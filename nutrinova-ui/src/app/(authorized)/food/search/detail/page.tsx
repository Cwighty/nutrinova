"use client";
import {
  Card,
  CardContent,
  List,
  ListItem,
  Typography,
  Chip,
  Button,
  Box,
} from "@mui/material";
import React from "react";
import CenteredSpinnerWithBackdrop from "@/components/CenteredSpinnerOverlay";
import {
  ImportFoodResponse,
  useGetFoodSearchResultQuery,
  useImportFoodMutation,
} from "../../foodHooks";
import { useRouter } from "next/navigation";
import { FoodSearchFilterParams } from "../../_models/foodSearchFilterParams";
import { FoodSearchDetailSkeleton } from "@/components/skeletons/FoodSearchDetailSkeleton";

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function Page({ searchParams }: PageProps) {
  const searchFilterParams: FoodSearchFilterParams = {
    foodName: searchParams["foodName"] as string,
    filterOption: searchParams["filterOption"] as string,
  };
  const fdcIdParam = searchParams["fdcid"];
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
        router.push("/food/" + response.id + "/edit");
      },
    });
  };

  if (!food || foodIsLoading) {
    return <FoodSearchDetailSkeleton />;
  }

  return (
    <>
      {importFoodMutation.isPending && (
        <CenteredSpinnerWithBackdrop message="Importing food..." />
      )}
      <Card sx={{ maxWidth: 600, my: 1, mx: "auto", p: 1.25 }}>
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
            <Box sx={{ mt: 1.25 }}>
              {food.ingredients.split(",").map((ingredient, index) => (
                <Chip
                  label={ingredient.trim()}
                  variant="outlined"
                  size="small"
                  sx={{ m: 0.5 }}
                  key={index}
                />
              ))}
            </Box>
          )}
          {food.servingSizeWithUnits && (
            <Typography variant="body1" paragraph sx={{ my: 1.5 }}>
              Serving Size: {parseFloat(food.servingSizeWithUnits).toFixed(2)}{" "}
              GRM
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
    </>
  );
}
