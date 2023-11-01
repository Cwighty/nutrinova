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
