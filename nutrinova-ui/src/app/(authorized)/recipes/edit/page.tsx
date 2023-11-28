import { PageContainer } from '@/components/PageContainer'
import React from 'react'
import { EditRecipeForm } from './_components/EditRecipeForm'
import { Box, Paper } from '@mui/material';

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function Page({ searchParams }: PageProps) {
  const recipeId = searchParams["recipeId"] as string;

  return (
    <PageContainer title="Edit Recipe">
      <Paper>
        <Box>
          <EditRecipeForm recipeId={recipeId} />
        </Box>
      </Paper>
    </PageContainer>
  )
}
