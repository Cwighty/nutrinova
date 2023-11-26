"use client"
import React from 'react';
import { Typography, Grid, Container, Box, Card, CardContent, Button } from '@mui/material';
import { ArrowCircleRight } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import customerService, { Customer } from '@/services/customerService';
import { getSession } from 'next-auth/react';

const Welcome = () => {
  const router = useRouter();

  const handleSingleUser = async () => {
    const session = await getSession();

    if (session == null || session == undefined) {
      throw new Error('Failed to get user session');
    }
    if (session.user.id == null || session.user.id == undefined) {
      throw new Error('Failed to get user id');
    }

    if (await customerService.customerExistsClient(session.user.id)) {
      router.push('/dashboard');
      return;
    }

    const customer = {
      objectId: session.user.id,
      email: session.user.email,
    } as Customer;
    const created = await customerService.createCustomer(customer);
    if (!created) {
      throw new Error('Failed to create customer');
    }
    router.push('/dashboard');
  }

  return (
    <Container>
      <Typography variant="h3" gutterBottom align="center" fontWeight="bold">
        Welcome to Nutrinova!
      </Typography>

      <Typography variant="h4" gutterBottom align="center" >
        How will you be using the application?
      </Typography>
      <Grid container spacing={4} justifyContent="center" alignItems="center">
        <Grid item xs={12}>
          <Box component="img" src="/single-multiple.png" alt="Self Care" sx={{ width: '80%', height: 'auto', mb: 4, display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />
        </Grid>

        <Grid item xs={12} sm={10}>
          <Card elevation={3}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="h6" gutterBottom textAlign={"center"}>
                    Track My Own Nutrition
                  </Typography>
                  <Typography variant="body2" color="textSecondary" textAlign="center">
                    Monitor and improve your dietary habits.
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="h6" gutterBottom textAlign="center">
                    Care For Someone Else
                  </Typography>
                  <Typography variant="body2" color="textSecondary" textAlign="center">
                    Assist others in tracking and improving their nutrition.
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Box display="flex" justifyContent="center">
                    <Button color="primary" onClick={() => handleSingleUser()}>
                      <ArrowCircleRight fontSize={'large'} />
                    </Button>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box display="flex" justifyContent="center">
                    <Button color="primary" onClick={() => {/* Handle click for care for others */ }}>
                      <ArrowCircleRight fontSize={'large'} />
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Welcome;