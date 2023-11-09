"use client";
import { Paper } from "@mui/material";
import { PageContainer } from "@/components/PageContainer";
import React, { useState } from "react";
import { MyFoodSearchForm } from "@/app/(authorized)/food/view/_components/MyFoodsSearchForm";
import { MyFoodsSearchResultDataGrid } from "@/app/(authorized)/food/view/_components/MyFoodsSearchResultDataGrid";
import { useDebounce } from "@uidotdev/usehooks";

export default function MyFoodsPage() {
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const searchKeywordDebounce = useDebounce(searchKeyword, 500);

  return (
    <PageContainer title={"My Foods"}>
      <Paper elevation={3} sx={{ p: 2, maxWidth: "90vw" }}>
        <MyFoodSearchForm setSearchTerm={setSearchKeyword} />
        <MyFoodsSearchResultDataGrid searchQuery={searchKeywordDebounce} />
      </Paper>
    </PageContainer>
  );
}
