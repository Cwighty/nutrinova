"use client";
import {
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  Typography,
  Chip,
  CardActions,
  Button,
  Skeleton,
} from "@mui/material";
import React from "react";
import CenteredSpinnerWithBackdrop from "@/components/CenteredSpinnerOverlay";
import { ImportFoodResponse, useGetFoodSearchResultQuery, useImportFoodMutation } from "../../foodHooks";
import { useRouter } from "next/navigation";
import { FoodSearchFilterParams } from "../../_models/foodSearchFilterParams";

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function Page({ searchParams }: PageProps) {
  const searchFilterParams: FoodSearchFilterParams = {
    foodName: searchParams["foodName"] as string,
    filterOption: searchParams["filterOption"] as string,
  }
  const fdcIdParam = searchParams["fdcid"];
  const fdcId = parseInt(fdcIdParam as string);
  const { data: food, isLoading: foodIsLoading } = useGetFoodSearchResultQuery(searchFilterParams, fdcId);

  const importFoodMutation = useImportFoodMutation();
  const router = useRouter();

  const handleImport = () => {
    importFoodMutation.mutate(
      food!.fdcId,
      {
        onSuccess: (response: ImportFoodResponse) => {
          router.push("/food/" + response.id + "/edit");
        }
      }
    );
  };

  if (!food || foodIsLoading) {
    return (
      <Card sx={{ maxWidth: 600, margin: "20px auto", padding: "20px" }}>
        <CardContent>
          <Skeleton variant="rectangular" width="100%" height={150} />
          <Skeleton variant="rectangular" width="100%" height={40} sx={{ my: 2 }} />
          <Skeleton variant="rectangular" width="100%" height={20} sx={{ my: 1 }} />
          <Skeleton variant="rectangular" width="100%" height={20} sx={{ my: 1 }} />
          <Skeleton variant="rectangular" width="100%" height={20} sx={{ my: 1 }} />
          <Skeleton variant="rectangular" width="100%" height={20} sx={{ my: 1 }} />
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      {importFoodMutation.isPending && <CenteredSpinnerWithBackdrop message="Importing food..." />}
      <Card sx={{ maxWidth: 600, margin: "20px auto", padding: "20px" }}>
        <CardActions style={{ justifyContent: "flex-end" }}>
          {food && (
            <Button variant="contained" color="primary" onClick={handleImport}>
              Import
            </Button>
          )}
        </CardActions>
        <CardContent>
          {food && (
            <>
              <Typography variant="h5" gutterBottom>
                {food.description}
              </Typography>
              {food.brandName && (
                <Typography variant="h6" color="primary" gutterBottom>
                  {food.brandName}
                </Typography>
              )}
              {food.ingredients && (
                <div style={{ margin: "10px 0" }}>
                  {food.ingredients.split(",").map((ingredient, index) => (
                    <Chip
                      label={ingredient.trim()}
                      variant="outlined"
                      size="small"
                      style={{ margin: "4px" }}
                      key={index}
                    />
                  ))}
                </div>
              )}
              {food.servingSizeWithUnits && (
                <Typography variant="body1" paragraph>
                  Serving Size: {parseFloat(food.servingSizeWithUnits).toFixed(2)}{" "}
                  GRM
                </Typography>
              )}
              {food.foodNutrients && food.foodNutrients.length > 0 && (
                <>
                  <Typography
                    variant="h6"
                    gutterBottom
                    style={{ marginTop: "20px" }}
                  >
                    Nutrients
                  </Typography>
                  <Divider />
                  <List dense>
                    {food.foodNutrients.map((nutrient) => (
                      <ListItem
                        key={nutrient.nameWithAmountAndUnit}
                        style={{ padding: "8px 0" }}
                        divider
                      >
                        <Typography variant="body2">
                          {nutrient.nutrientName}
                        </Typography>
                        <Typography
                          variant="body2"
                          style={{ marginLeft: "auto", fontWeight: "bold" }}
                        >
                          {nutrient.value} {nutrient.unitName}
                        </Typography>
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
}
