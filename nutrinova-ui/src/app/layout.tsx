import type { Metadata } from "next";
import { Session, getServerSession } from "next-auth";
import { MUIThemeProvider } from "@/context/ThemeContext";
import { NextAuthSessionProvider } from "@/components/providers/SessionProvider";
import { QueryClientNextProvider } from "@/components/providers/QueryClientNextProvider";
import { PatientProvider } from "@/components/providers/PatientProvider";

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
            <MUIThemeProvider>
              <PatientProvider>
                {children}
              </PatientProvider>
            </MUIThemeProvider>
          </QueryClientNextProvider>
        </NextAuthSessionProvider>
      </body >
    </html >
  );
}
