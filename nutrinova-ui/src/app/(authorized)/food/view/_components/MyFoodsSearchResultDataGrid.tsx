"use client";
import { FoodSearchResult } from "@/app/(authorized)/food/_models/foodSearchResult";
import { DataGrid, GridColDef, GridRowParams } from "@mui/x-data-grid";
import { Alert, Box, Skeleton } from "@mui/material";
import { useGetAllFoodForUserQuery } from "@/app/(authorized)/food/foodHooks";
import { NoFoodRowsOverlay } from "@/components/data-grid/NoFoodRowsOverlay";
import { useRouter } from "next/navigation";
import { searchParameters } from "../page";

interface MyFoodsSearchResultDataGridProps {
  searchQuery: searchParameters;
}

export const MyFoodsSearchResultDataGrid = ({
  searchQuery,
}: MyFoodsSearchResultDataGridProps) => {
  const router = useRouter();
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", minWidth: 100 },
    { field: "description", headerName: "Description", minWidth: 500 },
  ];
  const { data, isError, isLoading } = useGetAllFoodForUserQuery(searchQuery);

  const handleOnRowClick = (row: GridRowParams<FoodSearchResult>) => {
    router.push(`/food/view/${row.row.id}`);
  }

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
        onRowClick={handleOnRowClick}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        slots={{
          noRowsOverlay: NoFoodRowsOverlay,
        }}
      />
    </Box>
  );
};
