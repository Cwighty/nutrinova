"use client";
import { FoodSearchResult } from "@/app/(authorized)/food/_models/foodSearchResult";
import { DataGrid, GridColDef, GridRowParams } from "@mui/x-data-grid";

interface MyFoodsSearchResultDataGridProps {
  rows: FoodSearchResult[];
}

export const MyFoodsSearchResultDataGrid = ({
  rows,
}: MyFoodsSearchResultDataGridProps) => {
  // const router = useRouter();
  const columns: GridColDef[] = [
    { field: "fdcId", headerName: "ID", width: 100 },
    { field: "description", headerName: "Description", width: 500 },
  ];
  const handleRowClick = (row: GridRowParams<FoodSearchResult>) => {
    // router.push(`/food/search/detail?food=` + JSON.stringify(row.row));
  };
  return (
    <DataGrid
      getRowId={(row: FoodSearchResult) => row.description}
      rows={rows}
      columns={columns}
      onRowClick={handleRowClick}
      initialState={{
        pagination: { paginationModel: { pageSize: 10 } },
      }}
    />
  );
};
