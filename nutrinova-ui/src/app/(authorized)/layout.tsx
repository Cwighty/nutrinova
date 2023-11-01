import type { Metadata } from "next";
import { BottomNavBar } from "@/components/BottomNavBar";
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
    <>
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
    </>
  );
}