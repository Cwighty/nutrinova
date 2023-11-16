"use client";
import React from "react";
import CenteredSpinnerWithBackdrop from "@/components/CenteredSpinnerOverlay";
import { useImportFoodMutation } from "../../foodHooks";
import { FoodSearchFilterParams } from "../../_models/foodSearchFilterParams";
import { PageContainer } from "@/components/PageContainer";
import { SearchFoodsDetailCard } from "@/app/(authorized)/food/search/_components/SearchFoodsDetailCard";

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function Page({ searchParams }: PageProps) {
  const searchFilterParams: FoodSearchFilterParams = {
    foodName: searchParams["foodName"] as string,
    filterOption: searchParams["filterOption"] as string,
  };
  const fdcIdParam = searchParams["fdcid"];

  const importFoodMutation = useImportFoodMutation();

  return (
    <PageContainer title={"Search Details"}>
      {importFoodMutation.isPending && (
        <CenteredSpinnerWithBackdrop message="Importing food..." />
      )}
      <SearchFoodsDetailCard
        searchFilterParams={searchFilterParams}
        fdcIdParam={fdcIdParam}
      />
    </PageContainer>
  );
}
