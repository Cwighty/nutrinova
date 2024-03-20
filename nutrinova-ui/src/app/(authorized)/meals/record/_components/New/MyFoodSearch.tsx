"use client"
import { Add } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FilterMenu } from "./FilterMenu";
import { useGetAllFoodForUserQuery } from "@/app/(authorized)/food/foodHooks";
import { SearchParameters } from "@/app/(authorized)/food/view/page";
import { PrepMealCard } from "./PrepMealCard";

interface MyFoodSearchProps {
  searchKeyword: string;
}

export const MyFoodSearch: React.FC<MyFoodSearchProps> = ({ searchKeyword }: MyFoodSearchProps) => {

  const router = useRouter();
  const options = ["Date Created", "Name", "Calories"];
  const [sortby, setSortby] = useState<string>("Date Created");
  const searchParameters: SearchParameters = {
    nutrientSearchTerm: {
      id: 0, description: "", preferredUnitId: 0,
      categoryName: ""
    },
    foodSearchTerm: searchKeyword,
    comparisonOperator: "gt",
    nutrientValue: 0,
  };
  const { data, isError, isLoading } = useGetAllFoodForUserQuery(searchParameters);
  const sortedData = data?.sort((a, b) => {
    if (sortby === "Date Created") {
      return a.createdAt.getMilliseconds() - b.createdAt.getMilliseconds();
    }
    if (sortby === "Name") {
      return a.description.localeCompare(b.description);
    }
    return 0;
  });

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Button variant="text" color="primary" onClick={() => router.push("/food/create")}>
          <Add /> Create Food
        </Button>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Typography variant="h5">My Food</Typography>
        <FilterMenu options={options} selectedFilter={sortby} onFilterChange={(filter) => setSortby(filter)} />
      </Box>
      {isError && <div>Error loading recipes</div>}
      {isLoading && <div>Loading...</div>}
      {sortedData && sortedData.slice(0, 10).map((food) => {
        return PrepMealCard({ description: food.description, amount: food.servingSize, unit: food.servingSizeUnit, calories: 0 });
      })}
      {sortedData && sortedData.length === 0 &&
        (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Typography>No results</Typography>
          </Box>
        )}
    </Box>
  )
};