"use client";
import { PageContainer } from "@/components/PageContainer";
import { MyRecipesDetailCard } from "@/app/(authorized)/recipes/view/_components/MyRecipesDetailCard";

interface MyRecipesDetailPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function MyRecipesDetailPage({
  searchParams,
}: MyRecipesDetailPageProps) {
  const recipeId = searchParams["recipeId"] as string;

  return (
    <PageContainer title={"Recipe Details"}>
      <MyRecipesDetailCard recipeId={recipeId} />
    </PageContainer>
  );
}
