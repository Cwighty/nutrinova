"use client";

import { DataGrid, GridColDef, GridRowParams } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";

export interface FoodSearchResult {
  id: number;
  description: string;
}

interface SearchResultDataGridProps {
  rows: FoodSearchResult[];
}

export default function SearchResultDataGrid({
  rows,
}: SearchResultDataGridProps) {
  const router = useRouter();
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "description", headerName: "Description", width: 500 },
  ];
  const handleRowClick = (row: GridRowParams<FoodSearchResult>) => {
    console.log(JSON.stringify(row.row));
    router.push(`/food/search/detail?food=` + JSON.stringify(row.row));
  };

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      onRowClick={handleRowClick}
      initialState={{
        pagination: { paginationModel: { pageSize: 10 } },
      }}
    />
  );
}
