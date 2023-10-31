import type { Metadata } from "next";
import { MUIThemeProvider } from "@/components/MUIThemeProvider";
import { SessionProvider } from "../components/SessionProvider";
import { Session, getServerSession } from "next-auth";

export const metadata: Metadata = {
  title: "NutriNova",
  description: "NutriNova",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession() as Session;
  return (
    <html lang="en">
      <body>
        <SessionProvider session={session}>
          <MUIThemeProvider>
            {children}
          </MUIThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
