"use client";
import { MyRecipesSearchResultDataGrid } from "@/app/(authorized)/recipes/view/_components/MyRecipesSearchResultDataGrid";
import { Paper } from "@mui/material";
import { MyRecipesSearchForm } from "@/app/(authorized)/recipes/view/_components/MyRecipesSearchForm";
import { useState } from "react";

export const RecipeSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <Paper elevation={3} sx={{ p: 2, maxWidth: "90vw" }}>
      <MyRecipesSearchForm setSearchTerm={setSearchTerm} />
      <MyRecipesSearchResultDataGrid searchTerm={searchTerm} />
    </Paper>
  );
};
