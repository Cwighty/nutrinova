import FoodLayout from "@/app/food/FoodLayout";
import { FoodSearchResult } from "../SearchResultDataGrid";

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function Page({ searchParams }: PageProps) {
  const food: FoodSearchResult = JSON.parse(searchParams['food'] as string);

  return (
    <>
      <FoodLayout title="Detail">
        <h1>Food Search Detail</h1>
        <p>{food.description}</p>
      </FoodLayout>
    </>
  );
}