'use client'
import React from 'react';
import {
  TextField,
  Stepper,
  Step,
  StepLabel,
  Box,
  Paper,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useSearchMealItemsQuery } from '../../mealHooks';
import MealItemSelector from './MealItemSelector';
import { MealDetailsStep } from './MealDetailsStep';
import { MealSelectionItem } from '../_models/mealSelectionItem';


const steps = ['Select an Item', 'Meal Details'];

const PageLayout: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedItem, setSelectedItem] = React.useState<MealSelectionItem | null>(null);
  const [activeStep, setActiveStep] = React.useState(0);
  const { data: mealItems, isFetching } = useSearchMealItemsQuery(searchQuery);

  // A function to handle search input changes and initiate search
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // A function to handle item selection
  const handleSelectItem = (item: MealSelectionItem) => {
    setSelectedItem(item);
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  // Filtering meal items by type
  const customFoods = mealItems?.filter(item => item.type === 'CustomFood') || [];
  const recipes = mealItems?.filter(item => item.type === 'Recipe') || [];
  const usdaFoods = mealItems?.filter(item => item.type === 'USDAFood') || [];

  return (
    <Box sx={{ width: '100%' }}>
      <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
        {activeStep === 0 && (
          <>
            <TextField
              fullWidth
              id="search"
              label="Search"
              type='search'
              value={searchQuery}
              onChange={handleSearch}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {isFetching ? <CircularProgress /> : <SearchIcon />}
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 2,
              }}
            />
            <MealItemSelector
              customFoods={customFoods}
              recipes={recipes}
              usdaFoods={usdaFoods}
              onSelectItem={handleSelectItem}
            />
          </>
        )}

        {activeStep === 1 && selectedItem != null && (
          <>
            <MealDetailsStep selectedFood={selectedItem} setActiveStep={setActiveStep} />
          </>
        )}
        <Box sx={{ marginTop: 2 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label, index) => (
              <Step key={label} completed={index < activeStep} onClick={() => {
                if (index < activeStep) setActiveStep(index)
              }}
                sx={{ cursor: "pointer" }}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
      </Paper>
    </Box>
  );
};

export default PageLayout;
