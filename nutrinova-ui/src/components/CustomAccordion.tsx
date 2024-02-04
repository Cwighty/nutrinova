import React, { ReactNode } from 'react';
import {
  AccordionSummary,
  AccordionDetails,
  Typography
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion } from '../app/(authorized)/meals/record/_components/MealItemSelector';

export const CustomAccordion: React.FC<{ title: string; children: ReactNode; }> = ({ title, children }) => (
  <Accordion defaultExpanded>
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography>{title}</Typography>
    </AccordionSummary>
    <AccordionDetails>{children}</AccordionDetails>
  </Accordion>
);
