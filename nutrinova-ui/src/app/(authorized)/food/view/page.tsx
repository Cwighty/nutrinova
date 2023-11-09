"use client";
import { Paper } from "@mui/material";
import { PageContainer } from "@/components/PageContainer";
import React, { useState } from "react";
import { MyFoodSearchForm } from "@/app/(authorized)/food/view/_components/MyFoodsSearchForm";
import { MyFoodsSearchResultDataGrid } from "@/app/(authorized)/food/view/_components/MyFoodsSearchResultDataGrid";
import { useDebounce } from "@uidotdev/usehooks";
import { NutrientOption } from "../_models/nutrientOption";

export interface searchParameters {
  nutrientSearchTerm: NutrientOption,
  foodSearchTerm: string,
  comparisonOperator: string | undefined,
  nutrientValue: number | undefined,
}

export default function MyFoodsPage() {
  const [searchKeyword, setSearchKeyword] = useState<searchParameters>({
    nutrientSearchTerm: { id: 0, nutrientName: "", preferredUnit: 0 },
    foodSearchTerm: "",
    comparisonOperator: "gt",
    nutrientValue: 0,
  });
  const searchKeywordDebounce = useDebounce(searchKeyword, 500);

  return (
    <PageContainer title={"My Foods"}>
      <Paper elevation={3} sx={{ p: 2, maxWidth: "90vw" }}>
        <MyFoodSearchForm setSearchParameters={setSearchKeyword} currentSearchParameters={searchKeyword} />
        <MyFoodsSearchResultDataGrid searchQuery={searchKeywordDebounce} />
      </Paper>
    </PageContainer>
  );
}
