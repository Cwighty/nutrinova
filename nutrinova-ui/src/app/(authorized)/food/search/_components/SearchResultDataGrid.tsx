"use client";
import { DataGrid, GridColDef, GridRowParams } from "@mui/x-data-grid";
import { FlattenedFood } from "../../_models/foodSearchResult";
import { NoFoodRowsOverlay } from "@/components/data-grid/NoFoodRowsOverlay";
import { useRouter } from "next/navigation";
import { FoodSearchFilterParams } from "../../_models/foodSearchFilterParams";
import { Skeleton, Alert } from "@mui/material";
import { useGetFoodSearchResultsQuery } from "../../foodHooks";

interface SearchResultDataGridProps {
  filterParams: FoodSearchFilterParams;
}

export default function SearchResultDataGrid({
  filterParams,
}: SearchResultDataGridProps) {
  const router = useRouter();
  const {
    data: rows,
    isLoading,
    isError,
  } = useGetFoodSearchResultsQuery(filterParams);
  const columns: GridColDef[] = [
    { field: "description", headerName: "Food Name", flex: 1, minWidth: 200 },
    { field: "brandName", headerName: "Brand", width: 200 },
    {
      field: "servingSize",
      headerName: "Serving Size",
      valueGetter: (params) => {
        const row = params.row as FlattenedFood;
        return `${row.servingSize} ${row.servingSizeUnit}`;
      },
      width: 100,
    },
    {
      field: "calories",
      headerName: "Calories",
      width: 100,
      valueGetter: (params) => {
        const row = params.row as FlattenedFood;
        if (
          row.foodNutrients &&
          row.foodNutrients.map((x) => x.nutrientName).includes("Energy")
        ) {
          return row.foodNutrients.find((x) => x.nutrientName === "Energy")
            ?.value;
        }
        return "";
      },
    },
  ];
  const handleRowClick = (row: GridRowParams<FlattenedFood>) => {
    router.push(
      `/food/search/detail?fdcid=${row.id}&foodName=${filterParams.foodName}&filterOption=${filterParams.filterOption}`,
    );
  };

  return (
    <>
      {isLoading && (
        <Skeleton variant="rectangular" width="100%" height={200} />
      )}
      {isError && (
        <Alert severity="error">An error occurred while fetching data.</Alert>
      )}
      {rows && (
        <DataGrid
          getRowId={(row: FlattenedFood) => row.fdcId}
          rows={rows}
          columns={columns}
          onRowClick={handleRowClick}
          autoHeight
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          slots={{
            noRowsOverlay: () => NoFoodRowsOverlay(filterParams.foodName),
          }}
        />
      )}
    </>
  );
}
