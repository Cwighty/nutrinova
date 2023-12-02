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

const SelectableBox: React.FC<{ item: MealSelectionItem, onSelectItem: (item: MealSelectionItem) => void }> = ({ item, onSelectItem }) => (
  <Box
    sx={{
      marginBottom: 0,
      cursor: 'pointer',
      transition: '0.2s',
      '&:hover': {
        transform: 'translateX(-3px)',
      },
    }}
    onClick={() => onSelectItem(item)}
  >
    <MealSelectionItemCard item={item} />
  </Box>
);

export const MealItemSelector: React.FC<Props> = ({
  customFoods,
  recipes,
  usdaFoods,
  onSelectItem
}) => {
  return (
    <Box
      sx={{
        maxHeight: 'calc(100vh - 300px)',
        overflowY: 'auto',
      }}>
      <CustomAccordion title="Custom Foods">
        {customFoods.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            No custom foods found.
          </Typography>
        )}
        {customFoods.map(item => (
          <SelectableBox key={item.id} item={item} onSelectItem={onSelectItem} />
        ))}
      </CustomAccordion>

      <CustomAccordion title="Recipes">
        {recipes.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            No recipes found.
          </Typography>
        )}
        {recipes.map(item => (
          <SelectableBox key={item.id} item={item} onSelectItem={onSelectItem} />
        ))}
      </CustomAccordion>

      <CustomAccordion title="USDA">
        {usdaFoods.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            No USDA foods found.
          </Typography>
        )
        }
        {usdaFoods.map(item => (
          <SelectableBox key={item.id} item={item} onSelectItem={onSelectItem} />
        ))}
      </CustomAccordion>
    </Box>
  );
};

export default MealItemSelector;
