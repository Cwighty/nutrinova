import type { Metadata } from "next";
import { Provider } from "@/components/SessionProvider";
import { Session, getServerSession } from "next-auth";
import { MUIThemeProvider } from "@/context/ThemeContext";

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
        <Provider session={session}>
          <MUIThemeProvider>{children}</MUIThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
