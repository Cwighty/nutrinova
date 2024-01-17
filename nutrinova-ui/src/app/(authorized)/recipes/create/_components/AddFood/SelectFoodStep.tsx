'use client'
import React, { useState } from 'react';
import { Box, Typography } from "@mui/material";
import { MyFoodSearchForm } from "@/app/(authorized)/food/view/_components/MyFoodsSearchForm";
import { SelectFoodDataGrid } from "@/components/forms/SelectFoodDataGrid";
import { SearchParameters } from "@/app/(authorized)/food/view/page";
import { CreateRecipeFoodModel } from '../../_models/createRecipeFoodModel';
import { useDebounce } from '@uidotdev/usehooks';

interface SelectFoodStepProps {
  newFood: CreateRecipeFoodModel;
  setNewFood: (food: CreateRecipeFoodModel) => void; // Adjust the type according to your data structure
  validFoodSelected: boolean;
}

export const SelectFoodStep: React.FC<SelectFoodStepProps> = ({
  newFood,
  setNewFood,
  validFoodSelected
}) => {
  const [searchParameters, setSearchParameters] = useState<SearchParameters>({
    nutrientSearchTerm: {
      id: 0,
      description: "",
      preferredUnitId: 0,
      categoryName: "",
    },
    foodSearchTerm: "",
    comparisonOperator: "gt",
    nutrientValue: 0,
  });
  const searchParameterDebounce = useDebounce(searchParameters, 500);
  return (
    <Box sx={{ my: 2 }}>
      <MyFoodSearchForm
        modal
        setSearchParameters={setSearchParameters}
        currentSearchParameters={searchParameters}
      />
      <SelectFoodDataGrid
        searchQuery={searchParameterDebounce}
        onFoodSelected={(food) =>
          setNewFood({
            ...newFood,
            foodId: food.id,
            name: food.description,
          })
        }
      />
      {validFoodSelected ? (
        ""
      ) : (
        <Typography fontSize={12} color="error">
          Please select a food
        </Typography>
      )}
    </Box>
  );
};
