import { useGetFoodSearchResultsQuery, useGetUnitsQuery } from "@/app/(authorized)/food/foodHooks";
import { Box, LinearProgress, Typography } from "@mui/material";
import { PrepMealCard } from "./PrepMealCard";
import { FilterMenu } from "./FilterMenu";
import { useState } from "react";
import { PrepMealItem } from "../../_models/preMealItem";
import { useGetAllRecentMealsQuery } from "../../../mealHooks";

interface SearchAllProps {
  searchKeyword: string;
  setSelectedMealItem: (selectedMealItem: PrepMealItem | undefined) => void;
  addMeal: (selectedMealItem: PrepMealItem) => void;
}

export const SearchAll: React.FC<SearchAllProps> = ({ searchKeyword, setSelectedMealItem, addMeal }: SearchAllProps) => {
  const filterParams = {
    foodName: searchKeyword,
    filterOption: "Foundation",
  };

  const { data: usdaFoods, isLoading: usdaFoodsLoading } = useGetFoodSearchResultsQuery(filterParams);
  const options = ["Most Recent", "Name"];
  const [sortBy, setSortBy] = useState<string>(options[0]);

  const { data: units, isLoading: unitsLoading } = useGetUnitsQuery();

  const { data: mealHistory, isLoading: mealHistoryLoading } = useGetAllRecentMealsQuery();

  const sortedMealHistory = mealHistory?.sort((a, b) => {
    if (sortBy === "Most Recent") {
      return new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime();
    }
    if (sortBy === "Name") {
      return a.description.localeCompare(b.description);
    }
    return 0;
  });

  const sortedUsdaFoods = usdaFoods?.sort((a, b) => {
    if (sortBy === "Most Recent") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortBy === "Name") {
      return a.description.localeCompare(b.description);
    }
    return 0;
  });

  const showHistory = (searchKeyword === "");

  return (
    <Box sx={{ p: 2 }}>
      {showHistory &&
        (
          <>
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
              <Typography variant="h5">History</Typography>
              <FilterMenu options={options} selectedFilter={sortBy} onFilterChange={(filter) => setSortBy(filter)} />
            </Box>
            {mealHistoryLoading && <LinearProgress />}
            {
              sortedMealHistory && sortedMealHistory.slice(0, 5).map((meal) => {
                const mealItem: PrepMealItem = {
                  description: meal.description,
                  id: meal.id,
                  type: "ClonedMeal",
                  servingSize: meal.amount,
                  servingSizeUnit: meal.unit,
                  calories: meal.nutrientSummaries.find((summary) => summary.name.includes("Energy"))?.amount || 0
                }
                return <PrepMealCard key={meal.id} mealSelectionItem={mealItem} onDetailClick={(mealItem) => setSelectedMealItem(mealItem)} onAddClick={(mealItem) => addMeal(mealItem)} />
              })
            }
            {
              mealHistory && mealHistory.length === 0 &&
              (
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Typography>No results</Typography>
                </Box>
              )
            }
          </>
        )
      }
      {!showHistory && !unitsLoading && units && (
        <>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Typography variant="h5">All</Typography>
            <FilterMenu options={options} selectedFilter={sortBy} onFilterChange={(filter) => setSortBy(filter)} />
          </Box>
          {usdaFoodsLoading && <LinearProgress />}
          {usdaFoods && <div>{usdaFoods.length} results</div>}
          {sortedUsdaFoods && sortedUsdaFoods.slice(0, 5).map((food) => {
            const mealItem: PrepMealItem = {
              description: food.description,
              id: food.fdcId.toString(),
              type: "USDAFood",
              fdcid: food.fdcId,
              servingSize: food.servingSize == 0 ? 100 : food.servingSize,
              servingSizeUnit: units.find((unit) => unit.abbreviation.includes(food.servingSizeUnit)) ?? units[0],
              calories: food.foodNutrients.find((summary) => summary.nutrientName.includes("Energy"))?.value || 0
            }
            return <PrepMealCard key={food.id} mealSelectionItem={mealItem} onDetailClick={(mealItem) => setSelectedMealItem(mealItem)} onAddClick={(mealItem) => addMeal(mealItem)} />
          })
          }
        </>
      )}
    </Box>
  )
};