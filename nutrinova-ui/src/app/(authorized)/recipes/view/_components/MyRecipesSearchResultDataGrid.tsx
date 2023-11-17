"use client";
import { Recipe } from "@/app/(authorized)/recipes/create/_models/recipe";
import { Alert, Box, Skeleton } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { NoFoodRowsOverlay } from "@/components/data-grid/NoFoodRowsOverlay";
import { useGetAllRecipesQuery } from "@/app/(authorized)/recipes/recipeHooks";

export const MyRecipesSearchResultDataGrid = () => {
  const { data, isError, isLoading } = useGetAllRecipesQuery();
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", minWidth: 100 },
    { field: "description", headerName: "Description", minWidth: 500 },
  ];

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
        getRowId={(row: Recipe) => row.description}
        rows={data ?? []}
        columns={columns}
        autoHeight
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
