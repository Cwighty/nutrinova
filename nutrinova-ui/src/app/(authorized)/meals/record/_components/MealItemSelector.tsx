// FoodSelection.tsx
import React, { ReactNode } from 'react';
import {
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  styled,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import { MealSelectionItemCard } from './MealSelectionItemCard';
import { MealSelectionItem } from '../_models/mealSelectionItem';

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

interface Props {
  customFoods: MealSelectionItem[];
  recipes: MealSelectionItem[];
  usdaFoods: MealSelectionItem[];
  onSelectItem: (item: MealSelectionItem) => void;
}

const CustomAccordion: React.FC<{ title: string, children: ReactNode }> = ({ title, children }) => (
  <Accordion defaultExpanded>
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography>{title}</Typography>
    </AccordionSummary>
    <AccordionDetails>{children}</AccordionDetails>
  </Accordion>
);

export const MealItemSelector: React.FC<Props> = ({
  customFoods,
  recipes,
  usdaFoods,
  onSelectItem
}) => {
  return (
    <Box>
      <CustomAccordion title="Custom Foods">
        {customFoods.map(item => (
          <MealSelectionItemCard key={item.id} item={item} onSelect={() => onSelectItem(item)} />
        ))}
      </CustomAccordion>

      <CustomAccordion title="Recipes">
        {recipes.map(item => (
          <MealSelectionItemCard key={item.id} item={item} onSelect={() => onSelectItem(item)} />
        ))}
      </CustomAccordion>

      <CustomAccordion title="USDA">
        {usdaFoods.map(item => (
          <MealSelectionItemCard key={item.id} item={item} onSelect={() => onSelectItem(item)} />
        ))}
      </CustomAccordion>
    </Box>
  );
};

export default MealItemSelector;
