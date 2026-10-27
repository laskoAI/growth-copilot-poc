import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nuvera — Growth Copilot Demo",
  description: "Demo agenta AI do growth marketingu nad istniejącymi narzędziami wysyłek",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pl">
      <body className="antialiased">{children}</body>
    </html>
  );
}
