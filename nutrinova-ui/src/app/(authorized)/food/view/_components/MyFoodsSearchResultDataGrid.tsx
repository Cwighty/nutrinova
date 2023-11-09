"use client";
import { FoodSearchResult } from "@/app/(authorized)/food/_models/foodSearchResult";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Alert, Skeleton } from "@mui/material";
import React from "react";
import { useGetAllFoodForUserQuery } from "@/app/(authorized)/food/foodHooks";
import { NoFoodRowsOverlay } from "@/components/data-grid/NoFoodRowsOverlay";

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
    return <Skeleton height={100} sx={{ m: 0 }} />;
  }

  return (
    <DataGrid
      getRowId={(row: FoodSearchResult) => row.description}
      rows={data ?? []}
      columns={columns}
      sx={{ minHeight: 160, maxWidth: "89vw" }}
      initialState={{
        pagination: { paginationModel: { pageSize: 10 } },
      }}
      slots={{
        noRowsOverlay: NoFoodRowsOverlay,
      }}
    />
  );
};
