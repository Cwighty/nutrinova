'use client'
import { Paper } from "@mui/material";
import { PageContainer } from "@/components/PageContainer";
import React from "react";
import { EditFoodCard } from "./_components/EditFoodCard";

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}


export default function Page({ searchParams }: PageProps) {
  const foodId = searchParams["foodId"] as string;
  return (
    <PageContainer title={"Edit Food"}>
      <Paper elevation={3} sx={{ p: 2, maxWidth: "90vw" }}>
        <EditFoodCard foodId={foodId} />
      </Paper>
    </PageContainer>
  );
}
