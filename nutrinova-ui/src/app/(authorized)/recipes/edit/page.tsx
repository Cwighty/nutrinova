import { PageContainer } from '@/components/PageContainer'
import React from 'react'
import { EditRecipeForm } from './_components/EditRecipeForm'

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function Page({ searchParams }: PageProps) {
  const recipeId = searchParams["recipeId"] as string;

  return (
    <PageContainer title="Edit Recipe">
      <EditRecipeForm recipeId={recipeId} />
    </PageContainer>
  )
}
