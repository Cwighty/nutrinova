"use client";
import React from "react";
import { PageContainer } from "@/components/PageContainer";
import { MyFoodsDetailCard } from "@/app/(authorized)/food/view/_components/MyFoodsDetailCard";

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function Page({ searchParams }: PageProps) {
  const foodId = searchParams["foodId"] as string;

  return (
    <PageContainer title={"Food Details"}>
      <MyFoodsDetailCard foodId={foodId} />
    </PageContainer>
  );
}
