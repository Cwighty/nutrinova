import "./globals.css";
import type { Metadata } from "next";
import { BottomNavBar } from "@/components/BottomNavBar";
import { MUIThemeProvider } from "@/components/MUIThemeProvider";
import { NavigationSidebar } from "@/components/NavigationSidebar";
import { TopAppBar } from "@/components/TopAppBar";

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
              {children}
              <BottomNavBar />
            </div>
          </div>
        </MUIThemeProvider>
      </body>
    </html>
  );
}
