'use client'
import React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useRouter } from 'next/navigation';

const ErrorPage = ({ error, reset }: {
    error: Error, reset: () => void;
}) => {
    const router = useRouter();

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100vh"
            padding="24px"
        >
            <Typography variant="h6" color="error" fontWeight="bold">
                There was a problem
            </Typography>

            <Typography
                variant="h4"
                marginTop="16px"
                color="textPrimary"
                fontWeight="bold"
            >
                {error.message}
            </Typography>

            <Typography variant="h6" marginTop="24px" color="textSecondary">
                Please try again later or contact support if the problem persists.
            </Typography>

            <Box
                marginTop="40px"
                display="flex"
                gap="24px"
            >
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        reset();
                    }}
                >
                    Try again
                </Button>

                <Button onClick={() => router.push("/")} variant="outlined" color="primary">
                    Go back home
                </Button>
            </Box>
        </Box>
    );
}

export default ErrorPage;
