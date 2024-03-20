"use client"
import { Add } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FilterMenu } from "./FilterMenu";

interface MyFoodSearchProps {
  searchKeyword: string;
}

export const MyFoodSearch: React.FC<MyFoodSearchProps> = ({ searchKeyword }: MyFoodSearchProps) => {

  const router = useRouter();
  const options = ["Date Created", "Name", "Calories"];
  const [sortby, setSortby] = useState<string>("Date Created");
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
        {searchKeyword}
    </Box>
  )
};