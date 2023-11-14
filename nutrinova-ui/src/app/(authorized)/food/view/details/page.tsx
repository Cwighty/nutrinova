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
import React from "react";
import { useGetFoodByIdQuery } from "@/app/(authorized)/food/foodHooks";

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function Page({ searchParams }: PageProps) {
  const foodId = searchParams["foodId"] as string;

  const { data } = useGetFoodByIdQuery(foodId);

  return (
    <>
      <Card sx={{ maxWidth: 600, margin: "20px auto", padding: "20px" }}>
        <CardActions style={{ justifyContent: "flex-end" }}>
          <Button variant="contained" color="primary">
            Edit button here
          </Button>
        </CardActions>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {data?.description}
          </Typography>
          {data?.brandName && (
            <Typography variant="h6" color="primary" gutterBottom>
              {data?.brandName}
            </Typography>
          )}
          {data?.servingSize && (
            <Typography variant="body1" paragraph>
              Serving Size: {data?.servingSize}
            </Typography>
          )}
          {data?.ingredients && (
            <div style={{ margin: "10px 0" }}>
              {data?.ingredients
                .split(",")
                .map((ingredient, index) => (
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
          {data?.servingSizeWithUnits && (
            <Typography variant="body1" paragraph>
              Serving Size: {parseFloat(data?.servingSizeWithUnits).toFixed(2)}{" "}
              GRM
            </Typography>
          )}
          {data?.foodNutrients && data?.foodNutrients.length > 0 && (
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
                {data?.foodNutrients.map((nutrient) => (
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
          <Typography variant="h6" gutterBottom sx={{ mt: 1 }}>
            Notes
          </Typography>
          <Divider />
          {data?.note && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              {data?.note}
            </Typography>
          )}
        </CardContent>
      </Card>
    </>
  );
}
