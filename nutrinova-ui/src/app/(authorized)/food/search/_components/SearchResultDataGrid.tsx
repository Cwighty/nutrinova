"use client";
import { DataGrid, GridColDef, GridRowParams } from "@mui/x-data-grid";
import { FoodSearchResult } from "../../_models/foodSearchResult";
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
  const { data: rows, isLoading, isError } = useGetFoodSearchResultsQuery(filterParams);
  const columns: GridColDef[] = [
    { field: "fdcId", headerName: "ID", width: 100 },
    { field: "description", headerName: "Description", width: 500 },
  ];
  const handleRowClick = (row: GridRowParams<FoodSearchResult>) => {
    console.log(row.id);
    router.push(`/food/search/detail?fdcid=${row.id}&foodName=${filterParams.foodName}&filterOption=${filterParams.filterOption}`);
    console.log('should have pushed');
  };

  return (<>
    {isLoading &&
      <Skeleton variant="rectangular" width="100%" height={200} />
    }
    {isError &&
      <Alert severity="error">An error occurred while fetching data.</Alert>
    }
    {rows && (
      <DataGrid
        getRowId={(row: FoodSearchResult) => row.fdcId}
        rows={rows}
        columns={columns}
        onRowDoubleClick={handleRowClick}
        autoHeight
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        slots={{
          noRowsOverlay: NoFoodRowsOverlay,
        }}
      />)
    }
  </>
  );
}
