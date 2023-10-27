"use client";
import { Box, Button, MenuItem, TextField } from "@mui/material";
import SearchResultDataGrid, { FoodSearchResult } from "./SearchResultDataGrid";
import { ChangeEvent, useState } from "react";
import { Search } from "@mui/icons-material";

interface UsdaFoodDivisionOption {
  name: string;
  categories: string[];
}

export default function SearchFoods() {
  const usdaFoodDivisionOptions: UsdaFoodDivisionOption[] = [
    {
      name: "Foundation",
      categories: [
        "Baked Products",
        "Beef Products",
        "Beverages",
        "Cereal Grains and Pasta",
        "Dairy and Egg Products",
        "Fats and Oils",
        "Finfish and Shellfish Products",
        "Fruits and Fruit Juices",
        "Legumes and Legume Products",
        "Nut and Seed Products",
        "Pork Products",
        "Poultry Products",
        "Restaurant Foods",
        "Sausages and Luncheon Meats",
        "Soups, Sauces, and Gravies",
        "Spices and Herbs",
        "Sweets",
        "Vegetables and Vegetable Products",
      ],
    },
    {
      name: "SR Legacy",
      categories: [
        "American Indian/Alaska Native Foods",
        "Baby Foods",
        "Baked Products",
        "Beef Products",
        "Beverages",
        "Breakfast Cereals",
        "Cereal Grains and Pasta",
        "Dairy and Egg Products",
        "Fast Foods",
        "Fats and Oils",
        "Finfish and Shellfish Products",
        "Fruits and Fruit Juices",
        "Lamb, Veal, and Game Products",
        "Legumes and Legume Products",
        "Meals, Entrees, and Side Dishes",
        "Nut and Seed Products",
        "Pork Products",
        "Poultry Products",
        "Restaurant Foods",
        "Sausages and Luncheon Meats",
        "Snacks",
        "Soups, Sauces, and Gravies",
        "Spices and Herbs",
        "Sweets",
        "Vegetables and Vegetable Products",
      ],
    },
    {
      name: "Survey (FNDDS)",
      categories: [],
    },
    {
      name: "Branded",
      categories: [],
    },
    {
      name: "Experimental",
      categories: [],
    },
  ];

  const [selectedFoodDivision, setSelectedFoodDivision] = useState<string>(
    usdaFoodDivisionOptions[0].name
  );

  const [selectedFoodCategory, setSelectedFoodCategory] =
    useState<string>("All");

  const handleDivisionChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSelectedFoodDivision(e.target.value);
    setSelectedFoodCategory("All");
  };

  const handleCategoryChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSelectedFoodCategory(e.target.value);
  };

  const handleSearch = () => {
    console.log("searching usda for food");
  };

  const rows: FoodSearchResult[] = [
    { id: 1, description: "Eggs, Grade A, Large, egg white" },
    { id: 2, description: "Eggs, Grade A, Large, egg whole" },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <TextField
          fullWidth
          label="Search"
          variant="outlined"
          placeholder="Buttered toast"
          sx={{ my: 2 }}
        />
        <Button
          variant="contained"
          endIcon={<Search />}
          sx={{ my: 2 }}
          onClick={handleSearch}
        >
          Search
        </Button>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <TextField
          label="USDA Food Division"
          variant="outlined"
          fullWidth
          select
          value={selectedFoodDivision}
          onChange={handleDivisionChange}
          sx={{ my: 2 }}
        >
          {usdaFoodDivisionOptions.map((option) => (
            <MenuItem key={option.name} value={option.name}>
              {option.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Type"
          variant="outlined"
          fullWidth
          select
          value={selectedFoodCategory}
          onChange={handleCategoryChange}
          sx={{ my: 2 }}
        >
          <MenuItem value="All">All</MenuItem>
          {selectedFoodDivision &&
            usdaFoodDivisionOptions.map((option) => {
              if (option.name === selectedFoodDivision) {
                return option.categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ));
              }
            })}
        </TextField>
      </Box>
      <SearchResultDataGrid rows={rows} />
    </div>
  );
}
