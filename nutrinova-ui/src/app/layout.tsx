import type { Metadata } from "next";
import { Session, getServerSession } from "next-auth";
import { MUIThemeProvider } from "@/context/ThemeContext";
import { NextAuthSessionProvider } from "@/components/providers/SessionProvider";
import { QueryClientNextProvider } from "@/components/providers/QueryClientNextProvider";
import { PatientProvider } from "@/components/providers/PatientProvider";
import { NotificationProvider } from "@/components/providers/NotificationProvider";

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
              <NotificationProvider webSocketUrl={process.env.WEBSOCKET_URL}>
                <PatientProvider>{children}</PatientProvider>
              </NotificationProvider>
            </MUIThemeProvider>
          </QueryClientNextProvider>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
