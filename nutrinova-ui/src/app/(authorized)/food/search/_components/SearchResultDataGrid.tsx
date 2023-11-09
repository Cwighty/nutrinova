"use client";
import { DataGrid, GridColDef, GridRowParams } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { FoodSearchResult } from "../../_models/foodSearchResult";
import { NoFoodRowsOverlay } from "@/components/data-grid/NoFoodRowsOverlay";

interface SearchResultDataGridProps {
  rows: FoodSearchResult[];
}

export default function SearchResultDataGrid({
  rows,
}: SearchResultDataGridProps) {
  const router = useRouter();
  const columns: GridColDef[] = [
    { field: "fdcId", headerName: "ID", width: 100 },
    { field: "description", headerName: "Description", width: 500 },
  ];
  const handleRowClick = (row: GridRowParams<FoodSearchResult>) => {
    router.push(`/food/search/detail?food=` + JSON.stringify(row.row));
  };

  return (
    <DataGrid
      getRowId={(row: FoodSearchResult) => row.fdcId}
      rows={rows}
      columns={columns}
      onRowClick={handleRowClick}
      autoHeight
      initialState={{
        pagination: { paginationModel: { pageSize: 10 } },
      }}
      slots={{
        noRowsOverlay: NoFoodRowsOverlay,
      }}
    />
  );
}
