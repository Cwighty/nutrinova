import { useGetAllFoodForUserQuery, useGetFoodSearchResultsQuery } from "@/app/(authorized)/food/foodHooks";
import { Box, Typography } from "@mui/material";
import { PrepMealCard } from "./PrepMealCard";
import { FilterMenu } from "./FilterMenu";
import { useState } from "react";
import { SearchParameters } from "@/app/(authorized)/food/view/page";
import { PrepMealItem } from "../../_models/preMealItem";

interface SearchAllProps {
  searchKeyword: string;
  setSelectedMealItem: (selectedMealItem: PrepMealItem | undefined) => void;
}

export const SearchAll: React.FC<SearchAllProps> = ({ searchKeyword, setSelectedMealItem }: SearchAllProps) => {
  const filterParams = {
    foodName: searchKeyword,
    filterOption: "Foundation",
  };

  const { data: usdaFoods, isLoading: usdaFoodsLoading } = useGetFoodSearchResultsQuery(filterParams);
  const options = ["Most Recent", "Name", "Calories"];
  const [sortBy, setSortBy] = useState<string>(options[0]);

  const searchParameters: SearchParameters = {
    nutrientSearchTerm: {
      id: 0, description: "", preferredUnitId: 0,
      categoryName: ""
    },
    foodSearchTerm: "",
    comparisonOperator: "gt",
    nutrientValue: 0,
  };
  const { data: storedFoods, isLoading: storedFoodsLoading } = useGetAllFoodForUserQuery(searchParameters);
  const historyFoods = storedFoods?.filter((food) => food.imported);

  const showHistory = (!usdaFoods || usdaFoods.length === 0 || searchKeyword === "");

  const handleAddMeal = (mealSelectionItem: PrepMealItem) => {
  };

  return (
    <Box sx={{ p: 2 }}>
      {showHistory &&
        (
          <>
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
              <Typography variant="h5">History</Typography>
              <FilterMenu options={options} selectedFilter={sortBy} onFilterChange={(filter) => setSortBy(filter)} />
            </Box>
            {storedFoodsLoading && <div>Loading...</div>}
            {
              historyFoods && historyFoods.slice(0, 5).map((food) => {
                const mealItem: PrepMealItem = {
                  description: food.description,
                  id: food.id,
                  type: "Food",
                  servingSize: food.servingSize,
                  servingSizeUnit: food.servingSizeUnit,
                  calories: 0
                }
                return <PrepMealCard key={food.id} mealSelectionItem={mealItem} onDetailClick={(mealItem) => setSelectedMealItem(mealItem)} onAddClick={(mealItem) => handleAddMeal(mealItem)} />
              })
            }
            {
              historyFoods && historyFoods.length === 0 &&
              (
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Typography>No results</Typography>
                </Box>
              )
            }
          </>
        )
      }
      {!showHistory && (
        <>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Typography variant="h5">All</Typography>
            <FilterMenu options={options} selectedFilter={sortBy} onFilterChange={(filter) => setSortBy(filter)} />
          </Box>
          {usdaFoodsLoading && <div>Loading...</div>}
          {usdaFoods && <div>{usdaFoods.length} results</div>}
          {usdaFoods && usdaFoods.slice(0, 5).map((food) => {
            const mealItem: PrepMealItem = {
              description: food.description,
              id: food.id,
              type: "Food",
              servingSize: food.servingSize,
              servingSizeUnit: food.servingSizeUnit,
              calories: 0
            }
            return <PrepMealCard key={food.id} mealSelectionItem={mealItem} onDetailClick={(mealItem) => setSelectedMealItem(mealItem)} onAddClick={(mealItem) => handleAddMeal(mealItem)} />
          })
          }
        </>
      )}
    </Box>
  )
};