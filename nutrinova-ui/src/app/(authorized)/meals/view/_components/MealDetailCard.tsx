"use client";
import { format } from "date-fns";
import { Button, Grid, Paper, Stack, Typography } from "@mui/material";
import { Meal } from "@/app/(authorized)/meals/view/_models/viewMeal";
import { useRouter } from "next/navigation";

interface MealDetailCardProps {
  meal: Meal;
}

export const MealDetailCard = ({ meal }: MealDetailCardProps) => {
  const router = useRouter();

  const description = meal.description
    ? meal.description
    : "No description available";

  const mealTime = format(new Date(meal.recordedAt), "MMMM d, yyyy h:mm a");

  const amount = meal.amount;
  const unit = meal.unit;

  return (
    <Paper sx={{ p: 3 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        justifyContent="space-between"
      >
        <Typography variant="h4" >{description}</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push("/meals/edit?mealId=" + meal.id)}
        >
          Edit
        </Button>
      </Stack>
      <Grid container spacing={2} sx={{ my: 2 }} >
        <Grid item xs={12} md={6}>
          <Paper elevation={6} sx={{ p: 2 }}>
            <Typography variant="subtitle1" >
              Servings Eaten: {amount} {unit.abbreviation}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={6} sx={{ p: 2 }}>
            <Typography variant="subtitle1">
              {mealTime}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper elevation={6} sx={{ p: 2, mb: 2 }}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              Fed To Patient: {meal.patientResponse.firstname}{" "}
              {meal.patientResponse.lastname}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={6} sx={{ p: 2 }}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              Recorded By: {meal.recordedby}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      <Paper elevation={6} sx={{ p: 2 }}>
        <Typography variant={"h6"} sx={{ mb: 2 }}>
          Notes
        </Typography>
        {meal?.notes ? (
          <Typography variant="body2" sx={{ mt: 1 }}>
            {meal?.notes}
          </Typography>
        ) : (
          <Typography variant="body2" sx={{ mt: 1 }}>
            <em>None</em>
          </Typography>
        )}
      </Paper>
    </Paper >
  );
};
