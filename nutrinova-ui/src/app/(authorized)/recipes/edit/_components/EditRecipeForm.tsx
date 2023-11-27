'use client'

import React from 'react'
import { useGetRecipeByIdQuery } from '../../recipeHooks';

interface EditRecipeFormProps {
  recipeId: string;
}

export const EditRecipeForm = ({ recipeId }: EditRecipeFormProps) => {
  const { data: recipe } = useGetRecipeByIdQuery(recipeId);

  return (
    <div>
      <h1>Edit Recipe</h1>
      <p>Recipe ID: {recipeId}</p>
      <p>Recipe Description: {recipe?.description}</p>
    </div>
  );
}
