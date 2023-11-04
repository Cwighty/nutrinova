import type { Metadata } from "next";
import { Session, getServerSession } from "next-auth";
import { MUIThemeProvider } from "@/context/ThemeContext";
import { NextAuthSessionProvider } from "@/components/providers/SessionProvider";
import { QueryClientNextProvider } from "@/components/providers/QueryClientNextProvider";

export const metadata: Metadata = {
  title: "NutriNova",
  description: "NutriNova",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = (await getServerSession()) as Session;
  return (
    <html lang="en">
      <body>
        <NextAuthSessionProvider session={session}>
          <QueryClientNextProvider>
            <MUIThemeProvider>{children}</MUIThemeProvider>
          </QueryClientNextProvider>
        </NextAuthSessionProvider>
      </body >
    </html >
  );
}
