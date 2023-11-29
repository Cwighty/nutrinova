"use client";
import React from "react";
import { Container, Typography, Button, Box, Stack } from "@mui/material";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";

export default function LandingPage() {
  const router = useRouter();
  const { theme } = useTheme();

  const logoSrc = theme === "light" ? "/atomic-black.svg" : "/atomic-white.svg";

  return (
    <>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" }, // Stack on small screens, row on medium and up
            justifyContent: "space-between",
            alignItems: "center",
            p: "2rem",
            minHeight: "100vh",
            textAlign: "center",
          }}
        >
          <Container maxWidth="sm" sx={{ textAlign: "center", mt: 4 }}>
            <Box
              sx={{
                display: "inline-block",
                p: 2,
                borderRadius: "8px",
              }}
            >
              <Box
                component="img"
                sx={{
                  height: "auto",
                  width: {
                    xs: "250px",
                    sm: "300px",
                    md: "400px",
                  },
                }}
                src={logoSrc}
              />
            </Box>
          </Container>

          <Container maxWidth="md" sx={{ textAlign: "center" }}>
            <Typography variant="h3" component="h1" gutterBottom>
              Take Health Into Your Own Hands.
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom>
              Manage your nutrition and meal planning effortlessly with
              NutriNova, ensuring dietary precision for you and your loved ones.
            </Typography>
            <Box
              component="form"
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Stack direction="row" spacing={2} mb={4}>
                <Button
                  variant="contained"
                  onClick={() => router.push("/dashboard")}
                  sx={{ p: 2, minWidth: "50%" }}
                >
                  Login
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => router.push("/dashboard")}
                  sx={{ p: 2, minWidth: "50%" }}
                >
                  Register
                </Button>
              </Stack>
            </Box>
          </Container>
        </Box>
      </Container>
    </>
  );
}
