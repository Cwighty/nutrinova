import "./globals.css";
import type { Metadata } from "next";
import { BottomNavBar } from "@/components/BottomNavBar";
import { MUIThemeProvider } from "@/components/MUIThemeProvider";
import { NavigationSidebar } from "@/components/NavigationSidebar";
import { Box } from "@mui/material";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "NutriNova",
  description: "NutriNova",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <MUIThemeProvider>
          <Box style={{ display: "flex", flexDirection: "row" }}>
            <NavigationSidebar />
            <Box style={{ flex: 1 }}>
              {children}
              <BottomNavBar />
            </Box>
          </Box>
        </MUIThemeProvider>
      </body>
    </html>
  );
}
