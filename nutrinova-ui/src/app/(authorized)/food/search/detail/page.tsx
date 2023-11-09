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
} from "@mui/material";
import { FoodSearchResult } from "../../_models/foodSearchResult";
import React from "react";
import CenteredSpinnerWithBackdrop from "@/components/CenteredSpinnerOverlay";

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

async function importFood(fdcId: number) {
  console.log("simulate importing food with fdcId", fdcId);
  await new Promise((resolve) => setTimeout(resolve, 2000));
  console.log("imported food with fdcId", fdcId);
}

export default function Page({ searchParams }: PageProps) {
  const [loading, setLoading] = React.useState(false);
  const food = JSON.parse(searchParams["food"] as string) as FoodSearchResult;

  const handleImport = async () => {
    setLoading(true);
    await importFood(food.fdcId);
    setLoading(false);
  };

  return (
    <>
      {loading && <CenteredSpinnerWithBackdrop message="Importing food..." />}
      <Card sx={{ maxWidth: 600, margin: "20px auto", padding: "20px" }}>
        <CardActions style={{ justifyContent: "flex-end" }}>
          <Button variant="contained" color="primary" onClick={handleImport}>
            Import
          </Button>
        </CardActions>
        <CardContent>
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
        </CardContent>
      </Card>
    </>
  );
}
