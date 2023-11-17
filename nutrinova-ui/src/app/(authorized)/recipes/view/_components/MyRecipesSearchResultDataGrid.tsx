"use client";
import { Recipe } from "@/app/(authorized)/recipes/create/_models/recipe";
import { Alert, Box, Skeleton } from "@mui/material";
import { DataGrid, GridColDef, GridRowParams } from "@mui/x-data-grid";
import { NoFoodRowsOverlay } from "@/components/data-grid/NoFoodRowsOverlay";
import { useGetAllRecipesQuery } from "@/app/(authorized)/recipes/recipeHooks";
import { useRouter } from "next/navigation";

interface MyRecipesSearchResultDataGridProps {
  searchTerm: string;
}

export const MyRecipesSearchResultDataGrid = ({
  searchTerm,
}: MyRecipesSearchResultDataGridProps) => {
  const { data, isError, isLoading } = useGetAllRecipesQuery();
  const router = useRouter();
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", minWidth: 100 },
    { field: "description", headerName: "Description", minWidth: 500 },
  ];

  const handleOnRowClick = (row: GridRowParams<Recipe>) => {
    router.push(`/recipes/view/details?recipeId=${row.row.id}`);
  };

  const filteredData = data?.filter((recipe) => {
    return (
      recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

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
        rows={filteredData ?? []}
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
