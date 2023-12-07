"use client";
import { MealDetailCard } from "@/app/(authorized)/meals/view/_components/MealDetailCard";
import { useGetMealDetailsQuery } from "@/app/(authorized)/meals/mealHooks";
import { Alert, Skeleton } from "@mui/material";
import { PatientContextPageContainer } from "@/components/PatientContextPageContainer";

interface MealDetailPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function MealDetailPage({ searchParams }: MealDetailPageProps) {
  const mealId = searchParams["mealId"] as string;

  const { data: meal, isLoading, isError } = useGetMealDetailsQuery(mealId);

  return (
    <PatientContextPageContainer title={"Meal Details"}>
      {isLoading && <Skeleton variant="rectangular" height={200} />}
      {isError && <Alert severity="error">Error loading meal</Alert>}
      {meal && <MealDetailCard meal={meal} />}
    </PatientContextPageContainer>
  );
}
