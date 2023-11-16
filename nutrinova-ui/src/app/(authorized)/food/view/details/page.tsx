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
  Box,
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
      <Card sx={{ maxWidth: 600, my: 1, mx: "auto", p: 1.25 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="start">
            <Box>
              <Typography variant="h5" gutterBottom>
                {data?.description}
              </Typography>
              {data?.brandName && (
                <Typography variant="h6" color="primary" gutterBottom>
                  {data?.brandName}
                </Typography>
              )}
            </Box>
            <Button variant="contained" color="primary">
              Edit
            </Button>
          </Box>
          {data?.ingredients && (
            <Box sx={{ mt: 1.25 }}>
              {data?.ingredients
                .split(",")
                .map((ingredient, index) => (
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
          {data?.servingSizeWithUnits && (
            <Typography variant="body1" paragraph sx={{ my: 1.5 }}>
              Serving Size: {data?.servingSize.toFixed(2)}{" "}
              {data?.servingSizeUnit}
            </Typography>
          )}
          {data?.foodNutrients && data?.foodNutrients.length > 0 && (
            <>
              <Typography variant="h6" gutterBottom sx={{ mt: 1 }}>
                Nutrients
              </Typography>
              <Divider />
              <List dense>
                {data?.foodNutrients.map((nutrient) => (
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
