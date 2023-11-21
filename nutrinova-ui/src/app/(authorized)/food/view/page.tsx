"use client";
import { Paper } from "@mui/material";
import { PageContainer } from "@/components/PageContainer";
import React, { useState } from "react";
import { MyFoodSearchForm } from "@/app/(authorized)/food/view/_components/MyFoodsSearchForm";
import { MyFoodsSearchResultDataGrid } from "@/app/(authorized)/food/view/_components/MyFoodsSearchResultDataGrid";
import { useDebounce } from "@uidotdev/usehooks";
import { NutrientOption } from "../_models/nutrientOption";

export interface SearchParameters {
  nutrientSearchTerm: NutrientOption;
  foodSearchTerm: string;
  comparisonOperator: string | undefined;
  nutrientValue: number | undefined;
}

export default function MyFoodsPage() {
  const [searchParameters, setSearchParameters] = useState<SearchParameters>({
    nutrientSearchTerm: {
      id: 0, description: "", preferredUnitId: 0,
      category: ""
    },
    foodSearchTerm: "",
    comparisonOperator: "gt",
    nutrientValue: 0,
  });
  const searchParameterDebounce = useDebounce(searchParameters, 500);

  return (
    <PageContainer title={"My Foods"}>
      <Paper elevation={3} sx={{ p: 2, maxWidth: "90vw" }}>
        <MyFoodSearchForm
          setSearchParameters={setSearchParameters}
          currentSearchParameters={searchParameters}
        />
        <MyFoodsSearchResultDataGrid searchQuery={searchParameterDebounce} />
      </Paper>
    </PageContainer>
  );
}
