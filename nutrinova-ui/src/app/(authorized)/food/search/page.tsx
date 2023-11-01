import { Grid } from "@mui/material";
import FoodSearchForm from "./_components/FoodSearchForm";
import SearchResultDataGrid from "./_components/SearchResultDataGrid";
import { FoodSearchResult } from "./_models/foodSearchResult";
import { PageContainer } from "@/components/PageContainer";

export const metadata = {
  title: "Food Search",
};

interface PageProps {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

const fetchFoodSearchResults = async (searchParams: {
  [key: string]: string | string[] | undefined;
}) => {
  console.log(searchParams);
  if (!searchParams["foodName"] || searchParams["foodName"] === "") {
    return [];
  }
  const query = new URLSearchParams();
  query.set("foodName", searchParams["foodName"] as string);
  query.set("filterOption", searchParams["usdaFilterOption"] as string);

  const url = new URL(
    process.env.NUTRINOVA_API_URL + "/be/food/search?" + query.toString(),
  );
  const response = await fetch(url);

  if (response.ok) {
    return (await response.json()) as FoodSearchResult[];
  } else {
    throw new Error("Error fetching food search results: " + response.status);
  }
};

export default async function Page({ searchParams }: PageProps) {
  const rows = await fetchFoodSearchResults(searchParams);

  return (
    <PageContainer title={metadata.title}>
      <Grid container columnSpacing={4}>
        <Grid item xs={12} md={3}>
          <FoodSearchForm searchParams={searchParams} />
        </Grid>
        <Grid item xs={12} md={9}>
          <SearchResultDataGrid rows={rows} />
        </Grid>
      </Grid>
    </PageContainer>
  );
}
