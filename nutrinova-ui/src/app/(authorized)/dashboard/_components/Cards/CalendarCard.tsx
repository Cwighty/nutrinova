'use client'
import React from 'react';
import GenericCard from './GenericCard';
import { CalendarToday } from '@mui/icons-material';

const CalendarCard: React.FC = () => {
  return (
    <GenericCard title="December">
      {/* Calendar component would go here */}
      <CalendarToday />
      {/* Rest of the calendar UI */}
    </GenericCard>
  );
};

export default CalendarCard;
