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

  const { data, isLoading } = useGetFoodSearchResultsQuery(filterParams);
  const options = ["Most Recent", "Name", "Calories"];
  const [sortBy, setSortBy] = useState<string>(options[0]);

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Typography variant="h5">History</Typography>
        <FilterMenu options={options} selectedFilter={sortBy} onFilterChange={(filter) => setSortBy(filter)} />
      </Box>
      {isLoading && <div>Loading...</div>}
      {data && <div>{data.length} results</div>}
      {data && data.slice(0, 5).map((x) => {
        return <PrepMealCard key={x.id} description={x.description} amount={0} unit={x.servingSizeUnit} calories={0} />
      })}
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Typography variant="h5">All</Typography>
        <FilterMenu options={options} selectedFilter={sortBy} onFilterChange={(filter) => setSortBy(filter)} />
      </Box>
    </Box>
  )
};