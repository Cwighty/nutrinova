"use client";
import { Paper } from "@mui/material";
import { PageContainer } from "@/components/PageContainer";
import React from "react";
import { MyFoodSearchForm } from "@/app/(authorized)/food/view/_components/MyFoodsSearchForm";
import { MyFoodsSearchResultDataGrid } from "@/app/(authorized)/food/view/_components/MyFoodsSearchResultDataGrid";
import { useGetAllFoodForUserQuery } from "@/app/(authorized)/food/foodHooks";

export default function MyFoodsPage() {
  // call sample  data
  const results = useGetAllFoodForUserQuery();

  if (results.isError) {
    return <div>Error</div>;
  }
  return (
    <PageContainer title={"My Foods"}>
      <Paper elevation={3} sx={{ p: 2 }}>
        <MyFoodSearchForm />
        <MyFoodsSearchResultDataGrid rows={results.data ?? []} />
      </Paper>
    </PageContainer>
  );
}
