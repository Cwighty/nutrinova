import { Add } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { FilterMenu } from "./FilterMenu";
import { useState } from "react";

interface MyRecipeSearchProps {
  searchKeyword: string;
}

export const MyRecipeSearch: React.FC<MyRecipeSearchProps> = ({ searchKeyword }: MyRecipeSearchProps) => {

  const router = useRouter();
  const options = ["Date Created", "Name", "Calories"];
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
      {searchKeyword}
    </Box>
  )
};