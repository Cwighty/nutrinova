import "./globals.css";
import type { Metadata } from "next";
import { BottomNavBar } from "@/components/BottomNavBar";
import { MUIThemeProvider } from "@/components/MUIThemeProvider";

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
          {children}
          <BottomNavBar />
        </MUIThemeProvider>
      </body>
    </html>
  );
}
