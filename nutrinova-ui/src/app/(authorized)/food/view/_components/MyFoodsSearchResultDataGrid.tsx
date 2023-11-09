"use client";
import { FoodSearchResult } from "@/app/(authorized)/food/_models/foodSearchResult";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Alert } from "@mui/material";
import React from "react";
import { useGetAllFoodForUserQuery } from "@/app/(authorized)/food/foodHooks";
import CenteredSpinner from "@/components/CenteredSpinner";

interface MyFoodsSearchResultDataGridProps {
  searchQuery: string;
}

export const MyFoodsSearchResultDataGrid = ({
  searchQuery,
}: MyFoodsSearchResultDataGridProps) => {
  const columns: GridColDef[] = [
    { field: "fdcId", headerName: "ID", width: 100 },
    { field: "description", headerName: "Description", width: 500 },
  ];
  const { data, isError, isLoading } = useGetAllFoodForUserQuery(searchQuery);

  if (isError) {
    return <Alert severity="error">Error loading foods</Alert>;
  }

  if (isLoading) {
    return <CenteredSpinner />;
  }

  return (
    <DataGrid
      getRowId={(row: FoodSearchResult) => row.description}
      rows={data ?? []}
      columns={columns}
      initialState={{
        pagination: { paginationModel: { pageSize: 10 } },
      }}
    />
  );
};
