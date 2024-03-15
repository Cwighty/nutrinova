import type { Metadata } from "next";
import { MUIThemeProvider } from "@/context/ThemeContext";
import { QueryClientNextProvider } from "@/components/providers/QueryClientNextProvider";
import { PatientProvider } from "@/components/providers/PatientProvider";
import { ChatBotProvider } from "@/context/ChatBotContext";

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
        <QueryClientNextProvider>
          <MUIThemeProvider>
            <ChatBotProvider>
              <PatientProvider>{children}</PatientProvider>
            </ChatBotProvider>
          </MUIThemeProvider>
        </QueryClientNextProvider>
      </body>
    </html>
  );
}
