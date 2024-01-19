"use client";
import { FoodSearchResult } from "@/app/(authorized)/food/_models/foodSearchResult";
import { DataGrid, GridColDef, GridRowParams } from "@mui/x-data-grid";
import { Alert, Box, Skeleton } from "@mui/material";
import { useGetAllFoodForUserQuery } from "@/app/(authorized)/food/foodHooks";
import { NoFoodRowsOverlay } from "@/components/data-grid/NoFoodRowsOverlay";
import { useRouter } from "next/navigation";
import { SearchParameters } from "../page";
import { fn } from "@vitest/spy";

interface MyFoodsSearchResultDataGridProps {
  searchQuery: SearchParameters;
}

export const MyFoodsSearchResultDataGrid = ({
  searchQuery,
}: MyFoodsSearchResultDataGridProps) => {
  const router = useRouter();
  const columns: GridColDef[] = [
    {
      field: "description",
      headerName: "Food Name",
      flex: 1,
      minWidth: 200,
    },
    { field: "brandName", headerName: "Brand", width: 200 },
    {
      field: "servingSize",
      headerName: "Serving Size",
      valueGetter: (params) => {
        const row = params.row as FoodSearchResult;
        return `${row.servingSize} ${row.servingSizeUnit}`;
      },
      width: 100,
    },
    {
      field: "calories",
      headerName: "Calories",
      width: 100,
      valueGetter: (params) => {
        const row = params.row as FoodSearchResult;
        return (
          row.foodNutrients.find(
            (fn) => fn.nutrientName === "Energy (Calories)",
          )?.value ?? ""
        );
      },
    },
  ];
  const { data, isError, isLoading } = useGetAllFoodForUserQuery(searchQuery);

  const handleOnRowClick = (row: GridRowParams<FoodSearchResult>) => {
    router.push(`/food/view/details?foodId=${row.row.id}`);
  };

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
          noRowsOverlay: () => NoFoodRowsOverlay(searchQuery.foodSearchTerm),
        }}
      />
    </Box>
  );
};
