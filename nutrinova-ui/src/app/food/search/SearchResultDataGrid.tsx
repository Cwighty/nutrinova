"use client";

import { DataGrid, GridColDef } from "@mui/x-data-grid";

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
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "description", headerName: "Description", width: 500 },
  ];
  return <DataGrid rows={rows} columns={columns} pageSizeOptions={[5, 10]} />;
}
