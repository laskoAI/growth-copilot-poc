import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Growth Marketer AI — Demo",
  description: "Growth Marketer AI POC",
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
