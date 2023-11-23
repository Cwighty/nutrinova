'use client'
import { Paper } from "@mui/material";
import { PageContainer } from "@/components/PageContainer";
import React from "react";
import { EditFoodForm } from "./_components/EditFoodForm";

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}


export default function Page({ searchParams }: PageProps) {
  const foodId = searchParams["foodId"] as string;
  return (
    <PageContainer title={"Edit Food"}>
      <Paper elevation={3} sx={{ p: 2, maxWidth: "90vw" }}>
        <EditFoodForm foodId={foodId} />
      </Paper>
    </PageContainer>
  );
}
