import "./globals.css";
import type { Metadata } from "next";
import { BottomNavBar } from "@/components/BottomNavBar";
import { MUIThemeProvider } from "@/components/MUIThemeProvider";
import { NavigationSidebar } from "@/components/NavigationSidebar";
import { TopAppBar } from "@/components/TopAppBar";
import { Box } from "@mui/material";

export const metadata: Metadata = {
  title: "NutriNova",
  description: "NutriNova",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <MUIThemeProvider>
          <TopAppBar />
          <div style={{ display: "flex", flexDirection: "row" }}>
            <NavigationSidebar />
            <div style={{ flex: 1 }}>
              <Box sx={{ p: 2, mb: { xs: 3 } }} >
                {children}
              </Box>
              <BottomNavBar />
            </div>
          </div>
        </MUIThemeProvider>
      </body>
    </html>
  );
}
