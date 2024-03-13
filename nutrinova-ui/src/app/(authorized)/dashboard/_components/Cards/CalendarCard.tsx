'use client'
import React, { useState } from 'react';
import GenericCard from './GenericCard';
import { IconButton, Typography, Box, Stack, Badge } from '@mui/material';
import { ArrowBackIosNew, ArrowForwardIos, CalendarToday } from '@mui/icons-material';
import * as dateFns from 'date-fns';
import { styled } from '@mui/material/styles';

interface Event {
  date: string; // ISO date string 'yyyy-MM-dd'
  colors: string[]; // Array of color strings or theme keys
}

// An array of events, for example
const events: Event[] = [
  { date: '2023-12-02', colors: ['primary.dark', 'secondary.main'] },
  { date: '2023-11-29', colors: ['primary.main', 'secondary.main'] },
  // ... more events
];

const StyledBadge = styled(Badge)(() => ({
  '& .MuiBadge-badge': {
    bottom: '100%', // Place it below the element
    transform: 'translateX(-16%) translateY(32px)', // Center the dots and move them just below the date number
    padding: '0', // Remove padding if any
  },
}));


const CalendarCard: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(dateFns.startOfToday());

  const handlePrevWeek = () => {
    setCurrentDate((prevDate: Date) => dateFns.subDays(prevDate, 5));
  };

  const handleNextWeek = () => {
    if (dateFns.isToday(currentDate)) {
      // Prevent going to future weeks
      return;
    }
    setCurrentDate((prevDate: Date) => dateFns.addDays(prevDate, 5));
  };

  // Generate the last seven days including today
  const lastSevenDays = Array.from({ length: 5 }).map((_, i) =>
    dateFns.subDays(currentDate, i)
  ).reverse();

  const renderDots = (date: Date) => {
    const formattedDate = dateFns.format(date, 'yyyy-MM-dd');
    const dayEvents = events.find(event => event.date === formattedDate);
    return dayEvents?.colors.map((color, index) => (
      <Box
        key={index}
        sx={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          bgcolor: color,
          ml: 0.5,
        }}
      />
    ));
  };

  return (
    <GenericCard title={dateFns.format(currentDate, 'MMMM')} icon={<CalendarToday />}>
      <Stack direction="row" justifyContent="center" alignItems="center">
        <IconButton onClick={handlePrevWeek} size="large">
          <ArrowBackIosNew />
        </IconButton>
        {lastSevenDays.map((day, index) => (
          <Box key={index} sx={{ textAlign: 'center', marginX: 0.5 }}>
            <Typography variant="h6" display="block">
              {dateFns.format(day, 'EEE')}
            </Typography>
            <StyledBadge
              badgeContent={renderDots(day)}
              overlap="rectangular"
              sx={{
                bgcolor: dateFns.isToday(day) ? 'primary.main' : 'transparent',
                color: dateFns.isToday(day) ? 'common.white' : 'text.primary',
                borderRadius: 3,
                py: 0.5,
              }}
            >
              <Typography
                variant="h6"
                display="block"
                sx={{
                  px: 1,
                  py: 0.5, // Add some padding for the height
                }}
              >
                {dateFns.format(day, 'd')}
              </Typography>
            </StyledBadge>
          </Box>
        ))}
        <IconButton onClick={handleNextWeek} size="large" disabled={dateFns.isToday(currentDate)}>
          <ArrowForwardIos />
        </IconButton>
      </Stack>
    </GenericCard>
  );
};

export default CalendarCard;

