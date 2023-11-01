import type { Metadata } from "next";
import { MUIThemeProvider } from "@/components/MUIThemeProvider";
import { Provider } from "@/components/SessionProvider";
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
        <Provider session={session}>
          <MUIThemeProvider>
            {children}
          </MUIThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
