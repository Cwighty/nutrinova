'use client'
import { Grid, Paper } from "@mui/material";
import FoodSearchForm from "./_components/FoodSearchForm";
import SearchResultDataGrid from "./_components/SearchResultDataGrid";
import { PageContainer } from "@/components/PageContainer";
import { FoodSearchFilterParams } from "../_models/foodSearchFilterParams";
import React from "react";
import { useDebounce } from "@uidotdev/usehooks";

export default function Page() {
  const [filterParams, setFilterParams] = React.useState<FoodSearchFilterParams>({
    foodName: "",
    filterOption: "Foundation",
  });
  const [searchKeyword, setSearchKeyword] = React.useState<string>("");
  const foodName = useDebounce(searchKeyword, 500);

  return (
    <PageContainer title={"Food Search"}>
      <Paper elevation={3} sx={{ p: 2, maxWidth: "90vw" }}>
        <Grid container columnSpacing={4}>
          <Grid item xs={12} md={3}>
            <FoodSearchForm
              filterParams={filterParams}
              setFilterParams={setFilterParams}
              searchKeyword={searchKeyword}
              setSearchKeyword={setSearchKeyword} />
          </Grid>
          <Grid item xs={12} md={9}>
            <SearchResultDataGrid filterParams={{...filterParams, foodName}} />
          </Grid>
        </Grid>
      </Paper>
    </PageContainer>
  );
}
