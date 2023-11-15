"use client";
import { FoodSearchResult } from "@/app/(authorized)/food/_models/foodSearchResult";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Alert, Box, Skeleton } from "@mui/material";
import { useGetAllFoodForUserQuery } from "@/app/(authorized)/food/foodHooks";
import { NoFoodRowsOverlay } from "@/components/data-grid/NoFoodRowsOverlay";
import { SearchParameters } from "@/app/(authorized)/food/view/page";

interface MyFoodsSearchResultDataGridProps {
  searchQuery: SearchParameters;
  onFoodSelected: (food: FoodSearchResult) => void;
}

export const SelectFoodDataGrid = ({
  searchQuery,
  onFoodSelected,
}: MyFoodsSearchResultDataGridProps) => {
  const columns: GridColDef[] = [
    { field: "description", headerName: "Description", minWidth: 500 },
  ];
  const { data, isError, isLoading } = useGetAllFoodForUserQuery(searchQuery);

  if (isError) {
    return <Alert severity="error">Error loading foods</Alert>;
  }

  if (isLoading) {
    return <Skeleton height={100} sx={{ m: 0 }} />;
  }

  return (
    <Box
      sx={{
        mt: 2,
      }}
    >
      <DataGrid
        getRowId={(row: FoodSearchResult) => row.description}
        rows={data ?? []}
        columns={columns}
        autoHeight
        initialState={{
          pagination: { paginationModel: { pageSize: 5 } },
        }}
        slots={{
          noRowsOverlay: NoFoodRowsOverlay,
        }}
        onCellClick={(params) => {
          onFoodSelected(params.row as FoodSearchResult);
        }}
      />
    </Box>
  );
};