import { useGetFoodSearchResultsQuery } from "@/app/(authorized)/food/foodHooks";
import { Box, Typography } from "@mui/material";
import { PrepMealCard } from "./PrepMealCard";
import { FilterMenu } from "./FilterMenu";
import { useState } from "react";

interface SearchAllProps {
  searchKeyword: string;
}

export const SearchAll: React.FC<SearchAllProps> = ({ searchKeyword }: SearchAllProps) => {
  const filterParams = {
    foodName: searchKeyword,
    filterOption: "Foundation",
  };

  const { data: usdaFoods, isLoading: usdaFoodsLoading } = useGetFoodSearchResultsQuery(filterParams);
  const options = ["Most Recent", "Name", "Calories"];
  const [sortBy, setSortBy] = useState<string>(options[0]);

  const showHistory = (!usdaFoods || usdaFoods.length === 0 || searchKeyword === "");

  return (
    <Box sx={{ p: 2 }}>
      {showHistory &&
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Typography variant="h5">History</Typography>
          <FilterMenu options={options} selectedFilter={sortBy} onFilterChange={(filter) => setSortBy(filter)} />
        </Box>
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
            return <PrepMealCard key={food.id} description={food.description} amount={0} unit={food.servingSizeUnit} calories={0} />
          })
          }
        </>
      )}
    </Box>
  )
};