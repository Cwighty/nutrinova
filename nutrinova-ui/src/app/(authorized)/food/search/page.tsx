import { Grid } from "@mui/material";
import FoodSearchForm from "./_components/FoodSearchForm";
import SearchResultDataGrid from "./_components/SearchResultDataGrid";
import { FoodSearchResult } from "./_models/foodSearchResult";
import { PageContainer } from "@/components/PageContainer";
import createAuthenticatedAxiosInstanceFactory from "@/services/axiosRequestFactory";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";

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
  const session = await getServerSession(options);
  query.set("foodName", searchParams["foodName"] as string);
  query.set("filterOption", searchParams["usdaFilterOption"] as string);

  // const url = new URL(
  //   process.env.NUTRINOVA_API_URL + "/be/food/search?" + query.toString(),
  // );
  const foodSearchInstance = createAuthenticatedAxiosInstanceFactory(
    {
      additionalHeaders: {},
      origin: "server",
      sessionToken: session?.user.access_token
    }
  )
  const response = await foodSearchInstance.get("food/search?" + query.toString());

  if (response.data) {
    return (await response.data) as FoodSearchResult[];
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
