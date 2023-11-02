import type { Metadata } from "next";
import { BottomNavBar } from "@/components/BottomNavBar";
import { NavigationSidebar } from "@/components/NavigationSidebar";
import { Box } from "@mui/material";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "NutriNova",
  description: "NutriNova",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <Box style={{ display: "flex", flexDirection: "row" }}>
        <NavigationSidebar />
        <Box style={{ flex: 1 }}>
          {children}
          <BottomNavBar />
        </Box>
      </Box>
    </>
  );
}
