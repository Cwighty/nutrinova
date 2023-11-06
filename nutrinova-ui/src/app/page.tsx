'use client'
import React from 'react';
import { Container, Typography, Button, Box, Stack } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';

export default function LandingPage() {
  const router = useRouter();
  const { theme } = useTheme();

  const logoSrc = theme === 'light' ? '/atomic-black.svg' : '/atomic-white.svg';

  return (
    <>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' }, // Stack on small screens, row on medium and up
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '2rem',
            minHeight: '100vh',
            textAlign: 'center',
          }}
        >
          <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 4 }}>
            <Box sx={{
              display: 'inline-block', p: 2, borderRadius: '8px',
            }}>
              <Box
                component="img"
                sx={{
                  height: 'auto',
                  width: 400,
                }}
                src={logoSrc}
              />
            </Box>
          </Container>
          <Container maxWidth="md" sx={{ textAlign: 'center' }}>
            <Typography variant="h3" component="h1" gutterBottom>
              Take Health Into Your Own Hands.
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom>
              Manage your nutrition and meal planning effortlessly with NutriNova, ensuring dietary precision for you and your loved ones.
            </Typography>
            <Box
              component="form"
              sx={{
                '& > :not(style)': { m: 1, width: '25ch' },
                display: 'flex',
                justifyContent: 'center',
              }}
              noValidate
              autoComplete="off"
            >
              <Stack direction="row" spacing={2} mb={4}>
                <Button variant="contained" color="secondary" onClick={() => router.push('/dashboard')}>
                  Login
                </Button>
                <Button variant="outlined" color='secondary' onClick={() => router.push('/dashboard')}>
                  Create Account
                </Button>
              </Stack>
            </Box>
          </Container>
        </Box>
      </Container>
    </>
  );
}

