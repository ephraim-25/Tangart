import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Plam's Art | E-Learning & Marketplace",
  description: "World-class E-Learning infrastructure dedicated to art education. Elevate your craft with gallery-level aesthetics.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" data-theme="dark">
      <body>{children}</body>
    </html>
  );
}
