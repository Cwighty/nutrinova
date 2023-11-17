import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import React from "react";
import { useGetFoodByIdQuery } from "@/app/(authorized)/food/foodHooks";
import { useRouter } from "next/navigation";

interface MyFoodsDetailCardProps {
  foodId: string;
}

export const MyFoodsDetailCard = ({ foodId }: MyFoodsDetailCardProps) => {
  const { data } = useGetFoodByIdQuery(foodId);

  const router = useRouter();
  return (
    <Card sx={{ my: 1, p: 1.25 }}>
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
          <Button variant="contained" color="primary" onClick={() => router.push("/food/edit?foodId=" + foodId)}>
            Edit
          </Button>
        </Box>
        {data?.ingredients && (
          <Box
            sx={{
              mt: 1.25,
            }}
          >
            {data?.ingredients.split(",").map((ingredient, index) => (
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
        {data?.servingSizeWithUnits && (
          <Typography variant="body1" paragraph sx={{ my: 1.5 }}>
            Serving Size: {data?.servingSize.toFixed(2)} {data?.servingSizeUnit}
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
  );
};
