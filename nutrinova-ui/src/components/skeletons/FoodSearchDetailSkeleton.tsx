import { Card, CardContent, Skeleton } from "@mui/material";
import React from "react";

export const FoodSearchDetailSkeleton = () => {
  return (
    <Card sx={{ maxWidth: 600, margin: "20px auto", padding: "20px" }}>
      <CardContent>
        <Skeleton variant="rectangular" width="100%" height={150} />
        <Skeleton
          variant="rectangular"
          width="100%"
          height={40}
          sx={{ my: 2 }}
        />
        <Skeleton
          variant="rectangular"
          width="100%"
          height={20}
          sx={{ my: 1 }}
        />
        <Skeleton
          variant="rectangular"
          width="100%"
          height={20}
          sx={{ my: 1 }}
        />
        <Skeleton
          variant="rectangular"
          width="100%"
          height={20}
          sx={{ my: 1 }}
        />
        <Skeleton
          variant="rectangular"
          width="100%"
          height={20}
          sx={{ my: 1 }}
        />
      </CardContent>
    </Card>
  );
};
