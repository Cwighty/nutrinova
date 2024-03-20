import { Add } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { FilterMenu } from "./FilterMenu";
import { useState } from "react";
import { useGetAllRecipesQuery } from "@/app/(authorized)/recipes/recipeHooks";
import { PrepMealCard } from "./PrepMealCard";

interface MyRecipeSearchProps {
  searchKeyword: string;
}

export const MyRecipeSearch: React.FC<MyRecipeSearchProps> = ({ searchKeyword }: MyRecipeSearchProps) => {

  const router = useRouter();
  const options = ["Date Created", "Name", "Calories"];
  const { data, isError, isLoading } = useGetAllRecipesQuery();

  const filteredData = data?.filter((recipe) => {
    return (
      recipe.description.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      recipe.id.toLowerCase().includes(searchKeyword.toLowerCase())
    );
  });

  const sortedData = filteredData?.sort((a, b) => {
    if (sortBy === "Date Created") {
      return a.createdAt.getMilliseconds() - b.createdAt.getMilliseconds();
    }
    if (sortBy === "Name") {
      return a.description.localeCompare(b.description);
    }
    return 0;
  });

  const [sortBy, setSortBy] = useState<string>(options[0]);


  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Button variant="text" color="primary" onClick={() => router.push("/recipes/create")}>
          <Add /> Create Recipe
        </Button>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Typography variant="h5">My Recipes</Typography>
        <FilterMenu options={options} selectedFilter={sortBy} onFilterChange={(filter) => setSortBy(filter)} />
      </Box>
      {isError && <div>Error loading recipes</div>}
      {isLoading && <div>Loading...</div>}
      {sortedData && sortedData.slice(0, 10).map((recipe) => {
        return PrepMealCard({ description: recipe.description, amount: recipe.amount, unit: recipe.unit.abbreviation, calories: 0 });
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