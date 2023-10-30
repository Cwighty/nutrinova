import { Box, Grid } from "@mui/material";
import FoodSearchForm from "./FoodSearchForm";
import SearchResultDataGrid, { FoodSearchResult } from "./SearchResultDataGrid";
import FoodLayout from "../FoodLayout";

export const metadata = {
  title: "Food Search",
};

export interface UsdaFoodDivisionOption {
  name: string;
  categories: string[];
}

interface PageProps {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

const fetchFoodSearchResults = async (
  searchParams: { [key: string]: string | string[] | undefined }
) => {

  await new Promise((resolve) => setTimeout(resolve, 1000));
  if (searchParams["keyword"] === undefined || searchParams["keyword"] == "") return [];
  const foodSearchResults: FoodSearchResult[] = [];
  for (let i = 0; i < 1000; i++) {
    foodSearchResults.push({
      id: i,
      description: `Eggs, Grade A, Large, egg white ${i}`,
    });
  }

  return foodSearchResults;
};

export default async function Page({ searchParams }: PageProps) {
  console.log(searchParams);
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

  const rows = await fetchFoodSearchResults(searchParams);

  return (
    <>
      <FoodLayout title="Food Search">
        <Box sx={{ m: 2 }}>
          <Grid container columnSpacing={4}>
            <Grid item xs={12} md={3}>
              <FoodSearchForm
                usdaFoodDivisionOptions={usdaFoodDivisionOptions}
              />
            </Grid>
            <Grid item xs={12} md={9}>
              <SearchResultDataGrid rows={rows} />
            </Grid>
          </Grid>
        </Box>
      </FoodLayout>
    </>
  );
}
