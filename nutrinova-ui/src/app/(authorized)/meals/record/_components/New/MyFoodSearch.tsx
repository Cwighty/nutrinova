"use client"
import { Add } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FilterMenu } from "./FilterMenu";
import { useGetAllFoodForUserQuery } from "@/app/(authorized)/food/foodHooks";
import { SearchParameters } from "@/app/(authorized)/food/view/page";
import { PrepMealCard } from "./PrepMealCard";
import { PrepMealItem } from "../../_models/preMealItem";

interface MyFoodSearchProps {
  searchKeyword: string;
  setSelectedMealItem: (selectedMealItem: PrepMealItem | undefined) => void;
}

export const MyFoodSearch: React.FC<MyFoodSearchProps> = ({ searchKeyword, setSelectedMealItem }: MyFoodSearchProps) => {

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
      return a.createdAt?.getMilliseconds() - b.createdAt?.getMilliseconds();
    }
    if (sortby === "Name") {
      return a.description.localeCompare(b.description);
    }
    return 0;
  });

  const handleAddMeal = (mealSelectionItem: PrepMealItem) => {
  };

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
        const preMealItem: PrepMealItem = {
          description: food.description,
          id: food.id,
          type: "Food",
          servingSize: food.servingSize,
          servingSizeUnit: food.servingSizeUnit,
          calories: food.foodNutrients.find((summary) => summary.nutrientName.includes("Energy"))?.value || 0
        }
        return PrepMealCard({ mealSelectionItem: preMealItem, onDetailClick: () => setSelectedMealItem(preMealItem), onAddClick: () => handleAddMeal(preMealItem) });
      })
      }
      {sortedData && sortedData.length === 0 &&
        (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Typography>No results</Typography>
          </Box>
        )}
    </Box>
  )
};